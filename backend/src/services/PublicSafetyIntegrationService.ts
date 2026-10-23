import { dbPool } from '../config/db';
import { incidentService } from '../application/services/IncidentService';

/**
 * Serviço responsável por persistir telemetria geoespacial no PostGIS (Neon)
 * e acionar a Central 190 / COPOM via Webhook padronizado.
 * (Mantido para compatibilidade e delegando para a Clean Architecture)
 */
export class PublicSafetyIntegrationService {
  async syncOfflineLocationBatch(
    incidentId: string,
    points: Array<{ lat: number; lng: number; accuracy: number; capturedOffline: boolean; timestamp: string }>
  ) {
    if (!dbPool) {
      return incidentService.syncOfflineBatch(incidentId, {
        points: points.map((p) => ({
          latitude: p.lat,
          longitude: p.lng,
          accuracyMeters: p.accuracy,
          capturedOffline: p.capturedOffline,
          capturedAt: p.timestamp,
        })),
      });
    }

    const client = await dbPool.connect();
    try {
      await client.query('BEGIN');
      for (const pt of points) {
        await client.query(
          `INSERT INTO location_logs 
           (incident_id, latitude, longitude, geom, accuracy_meters, captured_offline, captured_at)
           VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($3, $2), 4326), $4, $5, $6)`,
          [incidentId, pt.lat, pt.lng, pt.accuracy || 10, pt.capturedOffline, pt.timestamp]
        );
      }
      await client.query('COMMIT');
      return { syncedCount: points.length };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async verifyTerminationPin(incidentId: string, enteredPin: string) {
    return incidentService.terminateIncident(incidentId, { pin: enteredPin });
  }
}
