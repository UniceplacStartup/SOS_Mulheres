import { z } from 'zod';

/**
 * Validação de Registro de Usuária
 */
export const registerUserSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido'),
  email: z.string().email('E-mail em formato inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  realPin: z.string().length(4, 'O PIN deve conter exatamente 4 dígitos').default('1234'),
  duressPin: z.string().length(4, 'O PIN de coação deve conter exatamente 4 dígitos').default('9999'),
  protectiveMeasureNumber: z.string().optional(),
});
export type RegisterUserInput = z.infer<typeof registerUserSchema>;

/**
 * Validação de Login
 */
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Validação de Abertura de SOS
 */
export const triggerSosSchema = z.object({
  userId: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracyMeters: z.number().optional().default(10),
  triggeredOffline: z.boolean().optional().default(false),
  capturedAt: z.string().optional(),
});
export type TriggerSosInput = z.infer<typeof triggerSosSchema>;

/**
 * Validação de Término de Ocorrência (PIN Real ou de Coação)
 */
export const terminateIncidentSchema = z.object({
  pin: z.string().min(4).max(6, 'O PIN deve ter entre 4 e 6 dígitos'),
});
export type TerminateIncidentInput = z.infer<typeof terminateIncidentSchema>;

/**
 * Validação de Ponto de Telemetria Contínua
 */
export const telemetryPointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracyMeters: z.number().optional().default(10),
  capturedOffline: z.boolean().optional().default(false),
  capturedAt: z.string().optional(),
});
export type TelemetryPointInput = z.infer<typeof telemetryPointSchema>;

/**
 * Validação de Lote de Pontos Sincronizados Pós-Offline
 */
export const syncOfflineBatchSchema = z.object({
  points: z.array(
    z.object({
      latitude: z.number(),
      longitude: z.number(),
      accuracyMeters: z.number().optional().default(10),
      capturedOffline: z.boolean().default(true),
      capturedAt: z.string(),
    })
  ).min(1, 'Pelo menos um ponto deve ser enviado para sincronização'),
});
export type SyncOfflineBatchInput = z.infer<typeof syncOfflineBatchSchema>;

/**
 * Validação de Contato de Emergência
 */
export const createContactSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  relationship: z.string().default('Amigo(a) / Familiar'),
  phone: z.string().min(8, 'Telefone inválido'),
  telegramChatId: z.string().optional(),
  email: z.string().email().optional(),
});
export type CreateContactInput = z.infer<typeof createContactSchema>;

/**
 * Validação de Evidência de Áudio
 */
export const audioEvidenceSchema = z.object({
  storageUrl: z.string().url().or(z.string().startsWith('data:audio')),
  sha256Checksum: z.string().length(64, 'Checksum SHA-256 deve conter exatamente 64 caracteres hexadecimais'),
  durationSeconds: z.number().positive(),
  recordedAt: z.string(),
});
export type AudioEvidenceInput = z.infer<typeof audioEvidenceSchema>;
