import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    PORT: z.coerce.number().positive().default(3000),
    MONGODB_URI: z.url(),
    JWT_SECRET: z.string().min(32),

    FRONTEND_APP_ORIGIN: z.url(),
    BACKEND_APP_ORIGIN: z.url(),
    GROQ_API_KEY: z.string().min(1),
    BARCODE_API_KEY: z.string().min(1).optional(),
    EMAIL_API_KEY: z.string().min(1),
    OPENWEATHER_API_KEY: z.string().min(1),
    ALERT_EMAIL: z.string(),

    AWS_REGION: z.string().min(1).optional(),
    AWS_S3_BUCKET: z.string().min(1).optional(),
    AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    AWS_S3_PUBLIC_BASE_URL: z.url().optional(),

    BLOG_IMAGE_MAX_MB: z.coerce.number().positive().default(5),
    BLOG_IMAGE_MAX_WIDTH: z.coerce.number().int().positive().default(1600),
    BLOG_IMAGE_WEBP_QUALITY: z.coerce.number().int().min(1).max(100).default(80),
})

const parseEnv = () => {
    const result = envSchema.safeParse(process.env);

    if(!result.success){
        console.error('Error parsing environment variables', result.error.issues);
        process.exit(1);
    }

    return result.data;
};

const env = parseEnv();

export default env;