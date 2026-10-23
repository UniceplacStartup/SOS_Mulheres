import { User, Incident, LocationLog, EmergencyContact, AudioEvidence } from '../../core/entities';
import { IncidentStatus } from '../../core/types';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByCpf(cpf: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
}

export interface IIncidentRepository {
  create(incident: Omit<Incident, 'id' | 'startedAt'>): Promise<Incident>;
  findById(id: string): Promise<Incident | null>;
  findByProtocol(protocolCode: string): Promise<Incident | null>;
  findActive(): Promise<Incident[]>;
  updateStatus(id: string, status: IncidentStatus, resolvedAt?: Date): Promise<void>;
  updateLastLocation(
    id: string,
    lat: number,
    lng: number,
    accuracy?: number,
    capturedOffline?: boolean,
    timestamp?: string
  ): Promise<void>;
}

export interface ILocationRepository {
  addPoint(log: Omit<LocationLog, 'id' | 'syncedAt'>): Promise<LocationLog>;
  addBatch(points: Array<Omit<LocationLog, 'id' | 'syncedAt'>>): Promise<number>;
  findByIncident(incidentId: string): Promise<LocationLog[]>;
}

export interface IContactRepository {
  findByUserId(userId: string): Promise<EmergencyContact[]>;
  create(contact: Omit<EmergencyContact, 'id' | 'createdAt'>): Promise<EmergencyContact>;
  delete(id: string, userId: string): Promise<boolean>;
}

export interface IAudioRepository {
  save(evidence: Omit<AudioEvidence, 'id' | 'uploadedAt'>): Promise<AudioEvidence>;
  findByIncident(incidentId: string): Promise<AudioEvidence[]>;
}
