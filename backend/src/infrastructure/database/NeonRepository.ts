import { dbPool, isNeonConnected } from '../../config/db';
import { User, Incident, LocationLog, EmergencyContact, AudioEvidence } from '../../core/entities';
import { IncidentStatus } from '../../core/types';
import {
  IUserRepository,
  IIncidentRepository,
  ILocationRepository,
  IContactRepository,
  IAudioRepository,
} from './IRepository';
import {
  InMemoryUserRepository,
  InMemoryIncidentRepository,
  InMemoryLocationRepository,
  InMemoryContactRepository,
  InMemoryAudioRepository,
} from './InMemoryStore';

const fallbackUserRepo = new InMemoryUserRepository();
const fallbackIncidentRepo = new InMemoryIncidentRepository();
const fallbackLocationRepo = new InMemoryLocationRepository();
const fallbackContactRepo = new InMemoryContactRepository();
const fallbackAudioRepo = new InMemoryAudioRepository();

/**
 * Repositório de Usuárias - Suporta Neon PostgreSQL com fallback InMemory
 */
export class NeonUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    if (!isNeonConnected() || !dbPool) return fallbackUserRepo.findById(id);

    try {
      const { rows } = await dbPool.query(
        `SELECT id, full_name as "fullName", cpf, email, password_hash as "passwordHash",
                real_pin_hash as "realPinHash", duress_pin_hash as "duressPinHash",
                protective_measure_number as "protectiveMeasureNumber",
                created_at as "createdAt", updated_at as "updatedAt"
         FROM users WHERE id = $1`,
        [id]
      );
      return rows[0] || null;
    } catch {
      return fallbackUserRepo.findById(id);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!isNeonConnected() || !dbPool) return fallbackUserRepo.findByEmail(email);

    try {
      const { rows } = await dbPool.query(
        `SELECT id, full_name as "fullName", cpf, email, password_hash as "passwordHash",
                real_pin_hash as "realPinHash", duress_pin_hash as "duressPinHash",
                protective_measure_number as "protectiveMeasureNumber",
                created_at as "createdAt", updated_at as "updatedAt"
         FROM users WHERE email = $1`,
        [email]
      );
      return rows[0] || null;
    } catch {
      return fallbackUserRepo.findByEmail(email);
    }
  }

  async findByCpf(cpf: string): Promise<User | null> {
    if (!isNeonConnected() || !dbPool) return fallbackUserRepo.findByCpf(cpf);

    try {
      const { rows } = await dbPool.query(
        `SELECT id, full_name as "fullName", cpf, email, password_hash as "passwordHash",
                real_pin_hash as "realPinHash", duress_pin_hash as "duressPinHash",
                protective_measure_number as "protectiveMeasureNumber",
                created_at as "createdAt", updated_at as "updatedAt"
         FROM users WHERE cpf = $1`,
        [cpf]
      );
      return rows[0] || null;
    } catch {
      return fallbackUserRepo.findByCpf(cpf);
    }
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    if (!isNeonConnected() || !dbPool) return fallbackUserRepo.create(user);

    try {
      const { rows } = await dbPool.query(
        `INSERT INTO users (full_name, cpf, email, password_hash, real_pin_hash, duress_pin_hash, protective_measure_number)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, full_name as "fullName", cpf, email, password_hash as "passwordHash",
                   real_pin_hash as "realPinHash", duress_pin_hash as "duressPinHash",
                   protective_measure_number as "protectiveMeasureNumber",
                   created_at as "createdAt", updated_at as "updatedAt"`,
        [
          user.fullName,
          user.cpf,
          user.email,
          user.passwordHash,
          user.realPinHash,
          user.duressPinHash,
          user.protectiveMeasureNumber || null,
        ]
      );
      return rows[0];
    } catch {
      return fallbackUserRepo.create(user);
    }
  }
}

/**
 * Repositório de Ocorrências (Incidents)
 */
export class NeonIncidentRepository implements IIncidentRepository {
  async create(incident: Omit<Incident, 'id' | 'startedAt'>): Promise<Incident> {
    if (!isNeonConnected() || !dbPool) return fallbackIncidentRepo.create(incident);

    try {
      const { rows } = await dbPool.query(
        `INSERT INTO incidents (protocol_code, user_id, status, triggered_offline, public_agency_notified)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, protocol_code as "protocolCode", user_id as "userId", status,
                   triggered_offline as "triggeredOffline", public_agency_notified as "publicAgencyNotified",
                   started_at as "startedAt", resolved_at as "resolvedAt"`,
        [
          incident.protocolCode,
          incident.userId,
          incident.status,
          incident.triggeredOffline,
          incident.publicAgencyNotified,
        ]
      );

      return {
        ...rows[0],
        victimName: incident.victimName,
        cpf: incident.cpf,
        protectiveMeasureNumber: incident.protectiveMeasureNumber,
        lastKnownLocation: incident.lastKnownLocation,
      };
    } catch {
      return fallbackIncidentRepo.create(incident);
    }
  }

  async findById(id: string): Promise<Incident | null> {
    return fallbackIncidentRepo.findById(id);
  }

  async findByProtocol(protocolCode: string): Promise<Incident | null> {
    return fallbackIncidentRepo.findByProtocol(protocolCode);
  }

  async findActive(): Promise<Incident[]> {
    return fallbackIncidentRepo.findActive();
  }

  async updateStatus(id: string, status: IncidentStatus, resolvedAt?: Date): Promise<void> {
    if (isNeonConnected() && dbPool) {
      try {
        await dbPool.query(
          `UPDATE incidents SET status = $1, resolved_at = $2 WHERE id = $3`,
          [status, resolvedAt || null, id]
        );
      } catch (e) {
        console.warn('[Neon UpdateStatus Error]', e);
      }
    }
    await fallbackIncidentRepo.updateStatus(id, status, resolvedAt);
  }

  async updateLastLocation(
    id: string,
    lat: number,
    lng: number,
    accuracy = 10,
    capturedOffline = false,
    timestamp = new Date().toISOString()
  ): Promise<void> {
    await fallbackIncidentRepo.updateLastLocation(id, lat, lng, accuracy, capturedOffline, timestamp);
  }
}

/**
 * Repositório PostGIS para Localização e Trilha Espacial
 */
export class NeonLocationRepository implements ILocationRepository {
  async addPoint(log: Omit<LocationLog, 'id' | 'syncedAt'>): Promise<LocationLog> {
    if (isNeonConnected() && dbPool) {
      try {
        const { rows } = await dbPool.query(
          `INSERT INTO location_logs 
           (incident_id, latitude, longitude, geom, accuracy_meters, captured_offline, captured_at)
           VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($3, $2), 4326), $4, $5, $6)
           RETURNING id, incident_id as "incidentId", latitude, longitude,
                     accuracy_meters as "accuracyMeters", captured_offline as "capturedOffline",
                     captured_at as "capturedAt", synced_at as "syncedAt"`,
          [
            log.incidentId,
            log.latitude,
            log.longitude,
            log.accuracyMeters || 10,
            log.capturedOffline,
            log.capturedAt,
          ]
        );
        return rows[0];
      } catch (err) {
        console.warn('[Neon PostGIS Point Error]', err);
      }
    }
    return fallbackLocationRepo.addPoint(log);
  }

  async addBatch(points: Array<Omit<LocationLog, 'id' | 'syncedAt'>>): Promise<number> {
    if (isNeonConnected() && dbPool) {
      const client = await dbPool.connect();
      try {
        await client.query('BEGIN');
        for (const pt of points) {
          await client.query(
            `INSERT INTO location_logs 
             (incident_id, latitude, longitude, geom, accuracy_meters, captured_offline, captured_at)
             VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($3, $2), 4326), $4, $5, $6)`,
            [
              pt.incidentId,
              pt.latitude,
              pt.longitude,
              pt.accuracyMeters || 10,
              pt.capturedOffline,
              pt.capturedAt,
            ]
          );
        }
        await client.query('COMMIT');
        return points.length;
      } catch (err) {
        await client.query('ROLLBACK');
        console.warn('[Neon PostGIS Batch Error]', err);
      } finally {
        client.release();
      }
    }
    return fallbackLocationRepo.addBatch(points);
  }

  async findByIncident(incidentId: string): Promise<LocationLog[]> {
    if (isNeonConnected() && dbPool) {
      try {
        const { rows } = await dbPool.query(
          `SELECT id, incident_id as "incidentId", latitude, longitude,
                  accuracy_meters as "accuracyMeters", captured_offline as "capturedOffline",
                  captured_at as "capturedAt", synced_at as "syncedAt"
           FROM location_logs WHERE incident_id = $1 ORDER BY captured_at ASC`,
          [incidentId]
        );
        return rows;
      } catch (e) {
        console.warn('[Neon Query Trail Error]', e);
      }
    }
    return fallbackLocationRepo.findByIncident(incidentId);
  }
}

export const userRepository: IUserRepository = new NeonUserRepository();
export const incidentRepository: IIncidentRepository = new NeonIncidentRepository();
export const locationRepository: ILocationRepository = new NeonLocationRepository();
export const contactRepository: IContactRepository = fallbackContactRepo;
export const audioRepository: IAudioRepository = fallbackAudioRepo;
