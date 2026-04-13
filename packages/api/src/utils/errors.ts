import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export class AppError extends Error implements FastifyError {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 400, code: string = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

export function setupErrorHandler(fastify: FastifyInstance): void {
  fastify.setErrorHandler((error: unknown, _request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Validation error',
        details: error.errors,
      });
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.message,
        code: error.code,
      });
    }

    if (error instanceof Error) {
      const statusCode = (error as FastifyError).statusCode || 500;
      return reply.status(statusCode).send({
        error: error.message || 'Internal server error',
      });
    }

    return reply.status(500).send({
      error: 'Internal server error',
    });
  });
}
