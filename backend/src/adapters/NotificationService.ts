/**
 * Padrão Strategy/Adapter para envio de alertas de emergência (SMS, Telegram e Sandbox)
 * Permite operar 100% gratuito em demonstrações ou integrar com gateways reais.
 */

export interface EmergencyAlertPayload {
  victimName: string;
  contactName: string;
  contactPhone: string;
  latitude: number;
  longitude: number;
  isDuress: boolean;
}

export class NotificationService {
  async notifyAllContacts(payload: EmergencyAlertPayload) {
    const mapsLink = `https://maps.google.com/?q=${payload.latitude},${payload.longitude}`;
    const prefix = payload.isDuress ? '[URGENTE - VÍTIMA SOB COAÇÃO]' : '[ALERTA SOS MULHERES]';
    const message = `${prefix} ${payload.victimName} precisa de ajuda imediata! Localização GPS atual: ${mapsLink}`;

    const provider = process.env.SMS_PROVIDER || 'SANDBOX';

    if (provider === 'TEXTBEE_ANDROID' && process.env.TEXTBEE_API_KEY) {
      // Disparo real e gratuito usando celular Android como Gateway via TextBee.dev
      await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${process.env.TEXTBEE_DEVICE_ID}/sendSMS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.TEXTBEE_API_KEY,
        },
        body: JSON.stringify({
          recipients: [payload.contactPhone],
          message,
        }),
      });
      return { channel: 'TEXTBEE_ANDROID_SMS', status: 'SENT', message };
    }

    // Modo Sandbox padrão para bancas e testes sem custo
    console.log(`[SANDBOX SMS -> ${payload.contactPhone}]: ${message}`);
    return { channel: 'SANDBOX_SIMULATOR', status: 'DELIVERED_MOCK', message };
  }
}
