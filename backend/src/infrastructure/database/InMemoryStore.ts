import { User, Incident, LocationLog, EmergencyContact, AudioEvidence } from '../../core/entities';
import { IncidentStatus } from '../../core/types';
import {
  IUserRepository,
  IIncidentRepository,
  ILocationRepository,
  IContactRepository,
  IAudioRepository,
} from './IRepository';

/**
 * Armazenamento Resiliente em Memória (Sandbox Mode)
 * Usado para demonstrações imediatas, testes locais sem dependência externa
 * e como fallback automático caso Neon esteja temporariamente inacessível.
 */
class InMemoryDatabaseStore {
  public users: Map<string, User> = new Map();
  public incidents: Map<string, Incident> = new Map();
  public locations: LocationLog[] = [];
  public contacts: Map<string, EmergencyContact> = new Map();
  public audioEvidences: AudioEvidence[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const defaultUser: User = {
      id: 'usr-default-001',
      fullName: 'Maria da Silva',
      cpf: '412.889.100-22',
      email: 'maria.silva@email.com',
      passwordHash: '12345678', // Para fins de sandbox/demo
      realPinHash: '1234',
      duressPinHash: '9999',
      protectiveMeasureNumber: 'MP-2026-991',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
    this.users.set(defaultUser.email, defaultUser);

    const contact1: EmergencyContact = {
      id: 'cnt-1',
      userId: defaultUser.id,
      name: 'Ana (Irmã)',
      relationship: 'Irmã',
      phone: '(11) 98765-4321',
      createdAt: new Date(),
    };
    const contact2: EmergencyContact = {
      id: 'cnt-2',
      userId: defaultUser.id,
      name: 'Delegacia 5ª DP',
      relationship: 'Autoridade Policial',
      phone: '(11) 3333-4444',
      createdAt: new Date(),
    };
    this.contacts.set(contact1.id, contact1);
    this.contacts.set(contact2.id, contact2);
  }
}

const memoryDb = new InMemoryDatabaseStore();

export class InMemoryUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return memoryDb.users.get(id) || null;
  }
  async findByEmail(email: string): Promise<User | null> {
    for (const u of memoryDb.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }
  async findByCpf(cpf: string): Promise<User | null> {
    for (const u of memoryDb.users.values()) {
      if (u.cpf.replace(/\D/g, '') === cpf.replace(/\D/g, '')) return u;
    }
    return null;
  }
  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryDb.users.set(newUser.id, newUser);
    return newUser;
  }
}

export class InMemoryIncidentRepository implements IIncidentRepository {
  async create(incident: Omit<Incident, 'id' | 'startedAt'>): Promise<Incident> {
    const newIncident: Incident = {
      ...incident,
      id: `inc-${Date.now()}`,
      startedAt: new Date(),
    };
    memoryDb.incidents.set(newIncident.id, newIncident);
    return newIncident;
  }

  async findById(id: string): Promise<Incident | null> {
    return memoryDb.incidents.get(id) || null;
  }

  async findByProtocol(protocolCode: string): Promise<Incident | null> {
    for (const inc of memoryDb.incidents.values()) {
      if (inc.protocolCode === protocolCode) return inc;
    }
    return null;
  }

  async findActive(): Promise<Incident[]> {
    return Array.from(memoryDb.incidents.values()).filter(
      (inc) => inc.status === 'ACTIVE' || inc.status === 'UNDER_DURESS'
    );
  }

  async updateStatus(id: string, status: IncidentStatus, resolvedAt?: Date): Promise<void> {
    const incident = memoryDb.incidents.get(id);
    if (incident) {
      incident.status = status;
      if (resolvedAt) incident.resolvedAt = resolvedAt;
      memoryDb.incidents.set(id, incident);
    }
  }

  async updateLastLocation(
    id: string,
    lat: number,
    lng: number,
    accuracy = 10,
    capturedOffline = false,
    timestamp = new Date().toISOString()
  ): Promise<void> {
    const incident = memoryDb.incidents.get(id);
    if (incident) {
      incident.lastKnownLocation = {
        latitude: lat,
        longitude: lng,
        accuracyMeters: accuracy,
        capturedOffline,
        timestamp,
      };
      memoryDb.incidents.set(id, incident);
    }
  }
}

export class InMemoryLocationRepository implements ILocationRepository {
  async addPoint(log: Omit<LocationLog, 'id' | 'syncedAt'>): Promise<LocationLog> {
    const newPoint: LocationLog = {
      ...log,
      id: `loc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      syncedAt: new Date().toISOString(),
    };
    memoryDb.locations.unshift(newPoint);
    return newPoint;
  }

  async addBatch(points: Array<Omit<LocationLog, 'id' | 'syncedAt'>>): Promise<number> {
    for (const pt of points) {
      await this.addPoint(pt);
    }
    return points.length;
  }

  async findByIncident(incidentId: string): Promise<LocationLog[]> {
    return memoryDb.locations.filter((l) => l.incidentId === incidentId);
  }
}

export class InMemoryContactRepository implements IContactRepository {
  async findByUserId(userId: string): Promise<EmergencyContact[]> {
    return Array.from(memoryDb.contacts.values()).filter((c) => c.userId === userId);
  }

  async create(contact: Omit<EmergencyContact, 'id' | 'createdAt'>): Promise<EmergencyContact> {
    const newContact: EmergencyContact = {
      ...contact,
      id: `cnt-${Date.now()}`,
      createdAt: new Date(),
    };
    memoryDb.contacts.set(newContact.id, newContact);
    return newContact;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const contact = memoryDb.contacts.get(id);
    if (contact && contact.userId === userId) {
      memoryDb.contacts.delete(id);
      return true;
    }
    return false;
  }
}

export class InMemoryAudioRepository implements IAudioRepository {
  async save(evidence: Omit<AudioEvidence, 'id' | 'uploadedAt'>): Promise<AudioEvidence> {
    const item: AudioEvidence = {
      ...evidence,
      id: `aud-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    };
    memoryDb.audioEvidences.push(item);
    return item;
  }

  async findByIncident(incidentId: string): Promise<AudioEvidence[]> {
    return memoryDb.audioEvidences.filter((a) => a.incidentId === incidentId);
  }
}
