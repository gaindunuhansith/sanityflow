import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as path from 'path';

const getEnvPath = () => {
    return path.resolve(process.cwd(), '.env');
};

const config = dotenv.config || (dotenv as any).default?.config;
if (config) {
    config({ path: getEnvPath() });
}

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
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