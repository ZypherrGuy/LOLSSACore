import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV:        z.enum(['development','production','test']).default('development'),
  PORT:            z.string().transform(Number),

  DB_HOST:         z.string(),
  DB_PORT:         z.string().transform(Number),
  DB_USERNAME:     z.string(),
  DB_PASSWORD:     z.string(),
  DB_NAME:         z.string(),

  USE_PUBLIC_DB:       z.string().optional().transform((s) => s === 'true'),
  PUBLIC_DB_HOST:      z.string().optional(),
  PUBLIC_DB_PORT:      z.string().optional().transform(Number),

  JWT_SECRET:          z.string(),

  RIOT_API_KEY:    z.string(),
  RIOT_BASE_URL:   z.string().url(),

  STRAPI_API_URL:    z.string().url(),
  STRAPI_API_TOKEN:  z.string(),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),

  CLIENT_URL: z.string().url(),
  CSRF_SECRET: z.string(),
});

export const env = EnvSchema.parse(process.env);
