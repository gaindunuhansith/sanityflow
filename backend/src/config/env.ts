import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    PORT: z.coerce.number().positive().default(5000),
    MONGODB_URI: z.url(),
    JWT_SECRET: z.string().min(32),

    FRONTEND_APP_ORIGIN: z.url(),
    BACKEND_APP_ORIGIN: z.url(),
    GROQ_API_KEY: z.string().min(1),
    EMAIL_API_KEY: z.string().min(1),
    OPENWEATHER_API_KEY: z.string().min(1),
    ALERT_EMAIL: z.string().email(),
})

const parseEnv = () => {
    const result = envSchema.safeParse(process.env);

    if(!result.success){
        console.error('Error parsing environment variables', result.error.format()); 
        process.exit(1);
    }

    return result.data;
};

const env = parseEnv();

export default env;