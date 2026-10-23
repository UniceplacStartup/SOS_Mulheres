import { env } from '../../config/env';
import { Incident } from '../../core/entities';

export interface CadIncidentDispatchPayload {
  protocolCode: string;
  timestamp: string;
  victim: {
    name: string;
    cpf: string;
    protectiveMeasureNumber?: string;
  };
  incident: {
    status: string;
    isDuress: boolean;
    priority: 'HIGH' | 'CRITICAL_SILENT_DURESS';
  };
  location: {
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
    googleMapsUrl: string;
    postGisPoint: string;
  };
}

/**
 * Adapter para integração do COPOM / CAD 190 (Computer Aided Dispatch)
 * Envia pacotes estruturados padrão Sistema Integrado de Segurança Pública
 */
export class CadWebhookService {
  async dispatchIncident(incident: Incident, isDuress = false) {
    const lat = incident.lastKnownLocation?.latitude || 0;
    const lng = incident.lastKnownLocation?.longitude || 0;

    const payload: CadIncidentDispatchPayload = {
      protocolCode: incident.protocolCode,
      timestamp: new Date().toISOString(),
      victim: {
        name: incident.victimName,
        cpf: incident.cpf,
        protectiveMeasureNumber: incident.protectiveMeasureNumber,
      },
      incident: {
        status: incident.status,
        isDuress,
        priority: isDuress ? 'CRITICAL_SILENT_DURESS' : 'HIGH',
      },
      location: {
        latitude: lat,
        longitude: lng,
        accuracyMeters: incident.lastKnownLocation?.accuracyMeters,
        googleMapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
        postGisPoint: `POINT(${lat} ${lng})`,
      },
    };

    try {
      // Disparo HTTP para a central externa se a URL for válida
      if (env.COPOM_CAD_WEBHOOK_URL && !env.COPOM_CAD_WEBHOOK_URL.includes('sandbox.seguranca.gov.br')) {
        await fetch(env.COPOM_CAD_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Dispatch-Priority': isDuress ? 'CRITICAL' : 'HIGH',
          },
          body: JSON.stringify(payload),
        });
      }

      console.log(
        `\x1b[32m[COPOM 190 CAD DISPATCH] Protocolo: ${incident.protocolCode} | Prioridade: ${
          isDuress ? 'CRÍTICA (COAÇÃO)' : 'ALTA'
        } | Ponto: POINT(${lat} ${lng})\x1b[0m`
      );

      return {
        dispatched: true,
        protocolCode: incident.protocolCode,
        payload,
      };
    } catch (err: any) {
      console.warn(`[COPOM CAD Error] ${err.message}`);
      return {
        dispatched: false,
        error: err.message,
        payload,
      };
    }
  }
}

export const cadWebhookService = new CadWebhookService();
