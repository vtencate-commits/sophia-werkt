import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Database & Cache
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/sophia_werkt',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  // AI
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  AI_MODEL: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
  AI_MAX_TOKENS: parseInt(process.env.AI_MAX_TOKENS || '4096', 10),

  // S3 / MinIO
  S3_ENDPOINT: process.env.S3_ENDPOINT || 'http://localhost:9000',
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || 'minioadmin',
  S3_SECRET_KEY: process.env.S3_SECRET_KEY || 'minioadmin',
  S3_BUCKET: process.env.S3_BUCKET || 'sophia-werkt',
  S3_REGION: process.env.S3_REGION || 'us-east-1',

  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@sophiawerkt.nl',

  // CORS Origins
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  LAWYER_URL: process.env.LAWYER_URL || 'http://localhost:3001',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:3002',
  API_URL: process.env.API_URL || 'http://localhost:3001',

  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  RATE_LIMIT_AUTH_MAX: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '10', 10),

  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
};
