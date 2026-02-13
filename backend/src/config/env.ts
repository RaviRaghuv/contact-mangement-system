import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default('5001'),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
    console.error("❌ Invalid environment variables:", envParsed.error.format());
    process.exit(1);
}

export const env = envParsed.data;
