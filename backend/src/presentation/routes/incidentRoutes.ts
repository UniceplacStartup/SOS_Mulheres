import { Router } from 'express';
import { incidentController } from '../controllers/IncidentController';

export const incidentRoutes = Router();

// Disparo de pânico SOS
incidentRoutes.post('/sos', incidentController.triggerSos.bind(incidentController));

// Listagem de ocorrências ativas para monitoramento COPOM 190
incidentRoutes.get('/active', incidentController.getActiveIncidents.bind(incidentController));

// Encerramento de ocorrência com verificação de PIN real vs Coação (9999)
incidentRoutes.post('/:id/terminate', incidentController.terminateIncident.bind(incidentController));

// Telemetria GPS em tempo real
incidentRoutes.post('/:id/telemetry', incidentController.streamLocation.bind(incidentController));

// Sincronização em lote de coordenadas capturadas offline (IndexedDB)
incidentRoutes.post('/:id/sync-offline', incidentController.syncOfflineBatch.bind(incidentController));

// Trilha geoespacial histórica do PostGIS
incidentRoutes.get('/:id/trail', incidentController.getIncidentTrail.bind(incidentController));

// Armazenamento de evidência jurídica de áudio com SHA-256
incidentRoutes.post('/:id/audio-evidence', incidentController.saveAudioEvidence.bind(incidentController));
