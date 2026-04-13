import type { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import { env } from '../config/env';

export async function corsPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(fastifyCors, {
    origin: [env.CLIENT_URL, env.LAWYER_URL, env.ADMIN_URL],
    credentials: true,
  });
}
