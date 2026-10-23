/**
 * Tipos e Enums do Domínio SOS Mulheres
 * Baseados nas definições legais e de segurança pública (COPOM / CAD 190)
 */

export type IncidentStatus = 'ACTIVE' | 'UNDER_DURESS' | 'RESOLVED';

export type AlertChannel =
  | 'SISTEMA'
  | 'SMS'
  | 'TELEGRAM'
  | 'WEBHOOK_190'
  | 'INDEXED_DB_OFFLINE'
  | 'POSTGIS_SYNC'
  | 'COACAO_CRITICA';

export interface GeoPoint {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  capturedOffline?: boolean;
  capturedAt: string;
}

export interface SecurityTerminationResult {
  uiAction: 'REAL_SHUTDOWN' | 'FAKE_SHUTDOWN';
  internalStatus: IncidentStatus;
  copomPriorityAlert?: string;
  message: string;
}
