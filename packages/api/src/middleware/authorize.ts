import type { FastifyRequest, FastifyReply } from 'fastify';
import type { UserRole, TokenPayload } from '@sophia-werkt/shared';

export function authorize(...roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      await request.jwtVerify();
      const payload = request.user as TokenPayload;
      if (!roles.includes(payload.role)) {
        return reply.status(403).send({ error: 'Forbidden' });
      }
    } catch (error) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  };
}
