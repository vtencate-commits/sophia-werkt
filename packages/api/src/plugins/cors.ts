import type { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import fp from 'fastify-plugin';
import { env } from '../config/env';

async function corsPluginFn(fastify: FastifyInstance): Promise<void> {
  await fastify.register(fastifyCors, {
    origin: [env.CLIENT_URL, env.LAWYER_URL, env.ADMIN_URL],
    credentials: true,
  });
}

export const corsPlugin = fp(corsPluginFn);
