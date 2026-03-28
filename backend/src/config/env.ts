import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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