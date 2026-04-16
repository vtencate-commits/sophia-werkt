import type { FastifyInstance } from 'fastify';
import type { LoginRequest, RegisterRequest, AuthTokens, TokenPayload } from '@sophia-werkt/shared';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/errors';

const LOCKOUT_TIME = 30 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const REFRESH_TOKEN_DAYS = 7;

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
    await prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async register(data: RegisterRequest): Promise<AuthTokens> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'CLIENT',
      },
    });

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(this.fastify, payload);
    const refreshToken = generateRefreshToken(this.fastify, payload);

    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async login(data: LoginRequest): Promise<AuthTokens> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AppError('Account locked due to too many failed attempts', 429, 'ACCOUNT_LOCKED');
    }

    const passwordMatch = await comparePassword(data.password, user.passwordHash);

    if (!passwordMatch) {
      const failedAttempts = user.failedLoginAttempts + 1;
      const update: Record<string, unknown> = { failedLoginAttempts: failedAttempts };

      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        update.lockedUntil = new Date(Date.now() + LOCKOUT_TIME);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: update,
      });

      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(this.fastify, payload);
    const refreshToken = generateRefreshToken(this.fastify, payload);

    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload: TokenPayload;
    try {
      payload = this.fastify.jwt.verify(refreshToken) as TokenPayload;
    } catch {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    // Revoke old token
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const newPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(this.fastify, newPayload);
    const newRefreshToken = generateRefreshToken(this.fastify, newPayload);

    await this.storeRefreshToken(user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return;
    }

    // Generate reset token as a short-lived JWT (not stored)
    const resetPayload = { userId: user.id, email: user.email, role: user.role, type: 'reset' };
    this.fastify.jwt.sign(resetPayload as unknown as TokenPayload, { expiresIn: '1h' });

    // TODO: Send email with reset token
  }

  async resetPassword(token: string, password: string): Promise<void> {
    let payload: TokenPayload & { type?: string };
    try {
      payload = this.fastify.jwt.verify(token) as TokenPayload & { type?: string };
    } catch {
      throw new AppError('Invalid or expired reset token', 400, 'INVALID_TOKEN');
    }

    if (payload.type !== 'reset') {
      throw new AppError('Invalid reset token', 400, 'INVALID_TOKEN');
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        passwordHash: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Revoke all refresh tokens on password reset
    await prisma.refreshToken.updateMany({
      where: { userId: payload.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
