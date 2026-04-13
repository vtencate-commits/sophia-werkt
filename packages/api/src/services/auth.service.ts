import type { FastifyInstance } from 'fastify';
import type { LoginRequest, RegisterRequest, AuthTokens, TokenPayload } from '@sophia-werkt/shared';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { AppError } from '../utils/errors';

const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes
const MAX_LOGIN_ATTEMPTS = 5;

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

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
        password: hashedPassword,
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

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async login(data: LoginRequest): Promise<AuthTokens> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Check lockout
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AppError('Account locked due to too many failed attempts', 429, 'ACCOUNT_LOCKED');
    }

    const passwordMatch = await comparePassword(data.password, user.password);

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

    // Reset failed attempts on successful login
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

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    let payload: TokenPayload;
    try {
      payload = this.fastify.jwt.verify(refreshToken) as TokenPayload;
    } catch {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }

    const newPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(this.fastify, newPayload);
    const newRefreshToken = generateRefreshToken(this.fastify, newPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = this.fastify.jwt.sign(
      { userId: user.id, email: user.email, role: user.role } as const,
      { expiresIn: '1h' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken },
    });

    // TODO: Send email with reset token
  }

  async resetPassword(token: string, password: string): Promise<void> {
    let payload: TokenPayload & { type: string };
    try {
      payload = this.fastify.jwt.verify(token) as TokenPayload & { type: string };
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
        password: hashedPassword,
        resetToken: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }
}
