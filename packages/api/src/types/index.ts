import type { TokenPayload } from '@sophia-werkt/shared';

declare module 'fastify' {
  interface FastifyRequest {
    user: TokenPayload;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: TokenPayload;
    user: TokenPayload;
  }
}

export type { TokenPayload };
