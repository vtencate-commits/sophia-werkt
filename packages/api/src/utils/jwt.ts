import type { FastifyInstance } from 'fastify';
import type { TokenPayload } from '@sophia-werkt/shared';

export function generateAccessToken(fastify: FastifyInstance, payload: TokenPayload): string {
  return fastify.jwt.sign(payload);
}

export function generateRefreshToken(fastify: FastifyInstance, payload: TokenPayload): string {
  return fastify.jwt.sign(payload, { expiresIn: '7d' });
}

export function verifyToken(fastify: FastifyInstance, token: string): TokenPayload {
  return fastify.jwt.verify(token) as TokenPayload;
}
