import type { FastifyRequest, FastifyReply } from 'fastify';
import type { TokenPayload } from '@sophia-werkt/shared';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
    const payload = request.user as TokenPayload;
    if (!payload.userId || !payload.email || !payload.role) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  } catch (error) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}
