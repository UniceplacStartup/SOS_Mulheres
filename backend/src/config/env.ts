import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

/**
 * Schema de validação das variáveis de ambiente com Zod
 * Garante falha rápida (fail-fast) ou fallback seguro em tempo de inicialização.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().optional(),
  SMS_PROVIDER: z.enum(['SANDBOX', 'TEXTBEE_ANDROID', 'TWILIO']).default('SANDBOX'),
  TEXTBEE_API_KEY: z.string().optional(),
  TEXTBEE_DEVICE_ID: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  COPOM_CAD_WEBHOOK_URL: z.string().default('https://sandbox.seguranca.gov.br/api/v1/cad-190'),
  CORS_ORIGIN: z.string().default('*'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Falha na validação das variáveis de ambiente:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
