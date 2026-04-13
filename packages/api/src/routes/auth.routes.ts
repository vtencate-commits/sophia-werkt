import type { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service';
import { LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../utils/validators';
import { authenticate } from '../middleware/authenticate';

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  const authService = new AuthService(fastify);

  fastify.post<{ Body: any }>('/register', async (request, reply) => {
    try {
      const data = RegisterSchema.parse(request.body);
      const tokens = await authService.register(data);
      return reply.status(201).send(tokens);
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Body: any }>('/login', async (request, reply) => {
    try {
      const data = LoginSchema.parse(request.body);
      const tokens = await authService.login(data);
      return reply.status(200).send(tokens);
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Body: { refreshToken: string } }>('/refresh', async (request, reply) => {
    try {
      const { refreshToken } = request.body;
      if (!refreshToken) {
        return reply.status(400).send({ error: 'Refresh token required' });
      }
      const tokens = await authService.refreshTokens(refreshToken);
      return reply.status(200).send(tokens);
    } catch (error) {
      throw error;
    }
  });

  fastify.post('/logout', { onRequest: authenticate }, async (request, reply) => {
    try {
      const userId = request.user?.userId;
      if (!userId) {
        return reply.status(401).send({ error: 'Unauthorized' });
      }
      await authService.logout(userId);
      return reply.status(200).send({ success: true });
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Body: any }>('/forgot-password', async (request, reply) => {
    try {
      const data = ForgotPasswordSchema.parse(request.body);
      await authService.forgotPassword(data.email);
      return reply.status(200).send({ message: 'Password reset email sent' });
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Body: any }>('/reset-password', async (request, reply) => {
    try {
      const data = ResetPasswordSchema.parse(request.body);
      await authService.resetPassword(data.token, data.password);
      return reply.status(200).send({ message: 'Password reset successful' });
    } catch (error) {
      throw error;
    }
  });
}
