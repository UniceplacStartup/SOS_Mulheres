import { env } from '../../config/env';

export interface EmergencyAlertPayload {
  victimName: string;
  contactName: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  isDuress: boolean;
  protectiveMeasureNumber?: string;
  protocolCode?: string;
}

export interface NotificationResult {
  channel: string;
  status: 'SENT' | 'DELIVERED_MOCK' | 'FAILED';
  message: string;
  error?: string;
}

/**
 * Padrão Strategy / Adapter para envio multicanal de alertas de emergência
 * Suporta Sandbox (custo zero), TextBee Android Gateway e Twilio SMS
 */
export class NotificationService {
  async notifyContact(payload: EmergencyAlertPayload): Promise<NotificationResult> {
    const mapsLink = `https://maps.google.com/?q=${payload.latitude},${payload.longitude}`;
    const prefix = payload.isDuress
      ? '🚨 [URGENTE - VÍTIMA SOB COAÇÃO SILENCIOSA]'
      : '⚠️ [ALERTA SOS MULHERES]';
    
    const message = `${prefix} ${payload.victimName} acionou socorro imediato! Localização GPS: ${mapsLink} (Protocolo: ${payload.protocolCode || 'SOS-190'})`;

    const provider = env.SMS_PROVIDER;

    // 1. Gateway Android Gratuito (TextBee.dev)
    if (provider === 'TEXTBEE_ANDROID' && env.TEXTBEE_API_KEY && env.TEXTBEE_DEVICE_ID) {
      try {
        const response = await fetch(
          `https://api.textbee.dev/api/v1/gateway/devices/${env.TEXTBEE_DEVICE_ID}/sendSMS`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': env.TEXTBEE_API_KEY,
            },
            body: JSON.stringify({
              recipients: [payload.contactPhone],
              message,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`TextBee retornou status ${response.status}`);
        }

        return { channel: 'TEXTBEE_ANDROID_SMS', status: 'SENT', message };
      } catch (err: any) {
        console.warn(`[Notification Error] Falha no TextBee, caindo para Sandbox: ${err.message}`);
      }
    }

    // 2. Provedor Twilio (se credenciais estiverem configuradas)
    if (provider === 'TWILIO' && env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_PHONE_NUMBER) {
      try {
        const auth = Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString('base64');
        const params = new URLSearchParams({
          To: payload.contactPhone,
          From: env.TWILIO_PHONE_NUMBER,
          Body: message,
        });

        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        );

        if (!response.ok) {
          throw new Error(`Twilio status ${response.status}`);
        }

        return { channel: 'TWILIO_SMS', status: 'SENT', message };
      } catch (err: any) {
        console.warn(`[Notification Error] Falha no Twilio, caindo para Sandbox: ${err.message}`);
      }
    }

    // 3. Modo Sandbox Padrão: Registra no log com formatação limpa para testes
    const logOutput = `[SANDBOX SMS -> ${payload.contactPhone} (${payload.contactName})]: ${message}`;
    console.log(`\x1b[36m%s\x1b[0m`, logOutput);

    return {
      channel: 'SANDBOX_SIMULATOR',
      status: 'DELIVERED_MOCK',
      message,
    };
  }

  async notifyTelegram(chatId: string, message: string): Promise<NotificationResult> {
    if (env.TELEGRAM_BOT_TOKEN) {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message }),
          }
        );
        if (response.ok) {
          return { channel: 'TELEGRAM', status: 'SENT', message };
        }
      } catch (e: any) {
        console.warn(`[Telegram Error] ${e.message}`);
      }
    }

    console.log(`\x1b[35m[SANDBOX TELEGRAM -> ${chatId}]: ${message}\x1b[0m`);
    return { channel: 'SANDBOX_TELEGRAM', status: 'DELIVERED_MOCK', message };
  }
}

export const notificationService = new NotificationService();
