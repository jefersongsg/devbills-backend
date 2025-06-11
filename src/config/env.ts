import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
    PORT: z.string().transform(Number).default("3000"),
    DATABASE_URL: z.string().min(5, "DATABASE_URL must be at least 5 characters long"),
    NODE_ENV: z.enum(["dev", "test", "prod"], {
        message: "NODE_ENV must be dev, test or prod"
    }),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("Invalid environment variables");
    process.exit(1);
}

export const env = _env.data;