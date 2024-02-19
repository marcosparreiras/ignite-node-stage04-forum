import { z } from "zod";

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
  REDIS_HOST: z.string().optional().default("127.0.0.1"),
  REDIS_PORT: z.number().optional().default(6379),
  REDIS_DB: z.number().optional().default(0),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_KEY_ID: z.string(),
});

export type Env = z.infer<typeof envSchema>;
