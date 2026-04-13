import Fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyCookie from '@fastify/cookie';

import { env } from './config/env';
import { corsPlugin } from './plugins/cors';
import { authPlugin } from './plugins/auth';
import { rateLimitPlugin } from './plugins/rateLimit';
import { setupErrorHandler } from './utils/errors';

import { authRoutes } from './routes/auth.routes';
import { casesRoutes } from './routes/cases.routes';
import { documentsRoutes } from './routes/documents.routes';
import { messagesRoutes } from './routes/messages.routes';
import { aiRoutes } from './routes/ai.routes';
import { invoicesRoutes } from './routes/invoices.routes';
import { notificationsRoutes } from './routes/notifications.routes';
import { usersRoutes } from './routes/users.routes';
import { adminRoutes } from './routes/admin.routes';

async function startServer(): Promise<void> {
  const fastify = Fastify({
    logger: env.NODE_ENV === 'development',
  });

  // Register security plugins
  await fastify.register(fastifyHelmet);

  // Register core plugins
  await fastify.register(corsPlugin);
  await fastify.register(authPlugin);
  await fastify.register(rateLimitPlugin);
  await fastify.register(fastifyCookie);
  await fastify.register(fastifyMultipart);

  // Register Swagger
  await fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Sophia Werkt API',
        description: 'Labor law advice portal API',
        version: '0.1.0',
      },
      host: `localhost:${env.PORT}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
  });

  // Setup error handler
  setupErrorHandler(fastify);

  // Register route plugins
  await fastify.register(
    async (fastify) => authRoutes(fastify),
    { prefix: '/api/v1/auth' }
  );

  await fastify.register(
    async (fastify) => casesRoutes(fastify),
    { prefix: '/api/v1/cases' }
  );

  await fastify.register(
    async (fastify) => documentsRoutes(fastify),
    { prefix: '/api/v1/documents' }
  );

  await fastify.register(
    async (fastify) => messagesRoutes(fastify),
    { prefix: '/api/v1/messages' }
  );

  await fastify.register(
    async (fastify) => aiRoutes(fastify),
    { prefix: '/api/v1/ai' }
  );

  await fastify.register(
    async (fastify) => invoicesRoutes(fastify),
    { prefix: '/api/v1/invoices' }
  );

  await fastify.register(
    async (fastify) => notificationsRoutes(fastify),
    { prefix: '/api/v1/notifications' }
  );

  await fastify.register(
    async (fastify) => usersRoutes(fastify),
    { prefix: '/api/v1/users' }
  );

  await fastify.register(
    async (fastify) => adminRoutes(fastify),
    { prefix: '/api/v1/admin' }
  );

  // Health check endpoint
  fastify.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok' });
  });

  // Start server
  try {
    await fastify.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`Server running on http://0.0.0.0:${env.PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
