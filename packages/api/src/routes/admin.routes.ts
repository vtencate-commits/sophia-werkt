import type { FastifyInstance } from 'fastify';
import { UserService } from '../services/user.service';
import type { CreateUserRequest, UpdateUserRequest, UserRole } from '@sophia-werkt/shared';
import { authorize } from '../middleware/authorize';
import { prisma } from '../config/database';

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  const userService = new UserService();

  fastify.get('/users', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const { limit = 50, offset = 0 } = request.query as any;
      const users = await userService.getAllUsers(parseInt(limit), parseInt(offset));
      return reply.send(users);
    } catch (error) {
      throw error;
    }
  });

  fastify.post<{ Body: CreateUserRequest }>('/users', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const user = await userService.createUser(request.body);
      return reply.status(201).send(user);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { userId: string }; Body: UpdateUserRequest }>('/users/:userId', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const userId = request.params.userId;
      const user = await userService.updateUser(userId, request.body);
      return reply.send(user);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { userId: string }; Body: { role: UserRole } }>('/users/:userId/role', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const userId = request.params.userId;
      const { role } = request.body;
      const user = await userService.changeUserRole(userId, role);
      return reply.send(user);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { userId: string } }>('/users/:userId/deactivate', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const userId = request.params.userId;
      const user = await userService.deactivateUser(userId);
      return reply.send(user);
    } catch (error) {
      throw error;
    }
  });

  fastify.patch<{ Params: { userId: string } }>('/users/:userId/activate', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const userId = request.params.userId;
      const user = await userService.activateUser(userId);
      return reply.send(user);
    } catch (error) {
      throw error;
    }
  });

  fastify.get('/stats', { onRequest: authorize('ADMIN') }, async (_request, reply) => {
    try {
      const totalUsers = await prisma.user.count();
      const totalCases = await prisma.case.count();
      const activeUsers = await prisma.user.count({ where: { isActive: true } });

      return reply.send({
        totalUsers,
        activeUsers,
        totalCases,
      });
    } catch (error) {
      throw error;
    }
  });

  fastify.get('/audit-log', { onRequest: authorize('ADMIN') }, async (request, reply) => {
    try {
      const { limit = 100 } = request.query as any;

      const auditLogs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit),
      });

      return reply.send(auditLogs);
    } catch (error) {
      throw error;
    }
  });
}
