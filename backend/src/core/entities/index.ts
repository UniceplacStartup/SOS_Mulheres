import { IncidentStatus } from '../types';

export interface User {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  passwordHash: string;
  realPinHash: string;      // PIN real (ex: 1234)
  duressPinHash: string;    // PIN de coação silenciosa (ex: 9999)
  protectiveMeasureNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Incident {
  id: string;
  protocolCode: string;
  userId: string;
  victimName: string;
  cpf: string;
  protectiveMeasureNumber?: string;
  status: IncidentStatus;
  triggeredOffline: boolean;
  publicAgencyNotified: boolean;
  startedAt: Date;
  resolvedAt?: Date | null;
  lastKnownLocation?: {
    latitude: number;
    longitude: number;
    accuracyMeters?: number;
    capturedOffline?: boolean;
    timestamp: string;
  };
}

export interface LocationLog {
  id: string;
  incidentId: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  capturedOffline: boolean;
  capturedAt: string;
  syncedAt: string;
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  telegramChatId?: string;
  email?: string;
  createdAt: Date;
}

export interface AudioEvidence {
  id: string;
  incidentId: string;
  storageUrl: string;
  sha256Checksum: string;
  durationSeconds: number;
  recordedAt: string;
  uploadedAt: string;
}
