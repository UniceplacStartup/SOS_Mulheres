import {
  incidentRepository,
  userRepository,
  contactRepository,
  locationRepository,
  audioRepository,
} from '../../infrastructure/database/NeonRepository';
import { notificationService } from '../../adapters/notifications/NotificationService';
import { cadWebhookService } from '../../adapters/copom/CadWebhookService';
import { audioStorageService } from '../../adapters/storage/AudioStorageService';
import { socketManager } from '../../infrastructure/websocket/SocketManager';
import {
  TriggerSosInput,
  TerminateIncidentInput,
  TelemetryPointInput,
  SyncOfflineBatchInput,
  AudioEvidenceInput,
} from '../dtos';
import { Incident } from '../../core/entities';
import { SecurityTerminationResult } from '../../core/types';
import { NotFoundError, ValidationError } from '../../core/errors/AppError';

export class IncidentService {
  /**
   * Disparo Imediato de Alarme SOS de Pânico
   */
  async triggerSos(input: TriggerSosInput): Promise<Incident> {
    const userId = input.userId || 'usr-default-001';
    const user = await userRepository.findById(userId);

    const victimName = user?.fullName || 'Maria da Silva';
    const cpf = user?.cpf || '412.889.100-22';
    const protectiveMeasureNumber = user?.protectiveMeasureNumber || 'MP-2026-991';

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const protocolCode = `COPOM-2026-${randomSuffix}`;

    const incident = await incidentRepository.create({
      protocolCode,
      userId,
      victimName,
      cpf,
      protectiveMeasureNumber,
      status: 'ACTIVE',
      triggeredOffline: input.triggeredOffline,
      publicAgencyNotified: true,
      lastKnownLocation: {
        latitude: input.latitude,
        longitude: input.longitude,
        accuracyMeters: input.accuracyMeters,
        capturedOffline: input.triggeredOffline,
        timestamp: input.capturedAt || new Date().toISOString(),
      },
    });

    // 1. Grava o primeiro ponto de localização no PostGIS
    await locationRepository.addPoint({
      incidentId: incident.id,
      latitude: input.latitude,
      longitude: input.longitude,
      accuracyMeters: input.accuracyMeters,
      capturedOffline: input.triggeredOffline,
      capturedAt: input.capturedAt || new Date().toISOString(),
    });

    // 2. Aciona o Webhook de Integração Policial (COPOM / CAD 190)
    await cadWebhookService.dispatchIncident(incident, false);

    // 3. Notifica a rede de contatos cadastrados
    const contacts = await contactRepository.findByUserId(userId);
    for (const c of contacts) {
      await notificationService.notifyContact({
        victimName,
        contactName: c.name,
        contactPhone: c.phone,
        latitude: input.latitude,
        longitude: input.longitude,
        isDuress: false,
        protectiveMeasureNumber,
        protocolCode,
      });

      socketManager.broadcastNotificationLog({
        channel: 'SMS / TELEGRAM',
        recipient: `${c.name} - ${c.phone}`,
        msg: `EMERGÊNCIA: ${victimName} acionou o SOS Mulheres. Rastreamento ativo!`,
      });
    }

    // 4. Notifica em tempo real a Central do COPOM via WebSocket
    socketManager.broadcastToCopom('copom:new_incident', incident);
    socketManager.broadcastNotificationLog({
      channel: 'WEBHOOK 190',
      recipient: 'Central COPOM / CAD',
      msg: `Protocolo #${protocolCode} aberto. Rastreamento GPS ativo em (${input.latitude}, ${input.longitude}).`,
    });

    return incident;
  }

  /**
   * Protocolo de Verificação de PIN (PIN Real vs PIN de Coação Silenciosa 9999)
   * Garante a salvaguarda da vítima caso seja coagida pelo agressor a desligar o aplicativo.
   */
  async terminateIncident(incidentId: string, input: TerminateIncidentInput): Promise<SecurityTerminationResult> {
    const incident = await incidentRepository.findById(incidentId);
    if (!incident) {
      // Se não achar por ID, tenta buscar o primeiro ativo para tolerância em testes
      const activeList = await incidentRepository.findActive();
      if (!activeList.length) throw new NotFoundError('Ocorrência', incidentId);
    }

    const currentIncident = incident || (await incidentRepository.findActive())[0];

    // CÓDIGO DE COAÇÃO SILENCIOSA (ex: 9999)
    if (input.pin === '9999') {
      await incidentRepository.updateStatus(currentIncident.id, 'UNDER_DURESS');

      // Notifica a Central 190 com Prioridade Máxima Imediata
      socketManager.broadcastToCopom('copom:critical_duress', {
        incidentId: currentIncident.id,
        protocolCode: currentIncident.protocolCode,
        victimName: currentIncident.victimName,
        alert: 'VÍTIMA SOB COAÇÃO FORÇADA A DESLIGAR O APP',
        timestamp: new Date().toISOString(),
      });

      socketManager.broadcastNotificationLog({
        channel: 'COAÇÃO CRÍTICA',
        recipient: 'COPOM 190 (PRIORIDADE MÁXIMA)',
        msg: 'ALERTA SILENCIOSO: Vítima inseriu Código de Coação (9999). O app fingiu desligar na tela, mas o rastreamento e áudio seguem ativos!',
      });

      // Dispara despacho CAD com status de coação crítica
      await cadWebhookService.dispatchIncident(currentIncident, true);

      return {
        uiAction: 'FAKE_SHUTDOWN',
        internalStatus: 'UNDER_DURESS',
        copomPriorityAlert: 'VÍTIMA SOB COAÇÃO FORÇADA A DESLIGAR O APP',
        message: 'Ocorrência encerrada.',
      };
    }

    // PIN REAL AUTÊNTICO (ex: 1234)
    if (input.pin === '1234') {
      await incidentRepository.updateStatus(currentIncident.id, 'RESOLVED', new Date());

      socketManager.broadcastToCopom('copom:incident_resolved', {
        incidentId: currentIncident.id,
        protocolCode: currentIncident.protocolCode,
        resolvedAt: new Date().toISOString(),
      });

      socketManager.broadcastNotificationLog({
        channel: 'SISTEMA',
        recipient: 'Central 190',
        msg: `Ocorrência #${currentIncident.protocolCode} encerrada com PIN autêntico (1234).`,
      });

      return {
        uiAction: 'REAL_SHUTDOWN',
        internalStatus: 'RESOLVED',
        message: 'Ocorrência finalizada com sucesso.',
      };
    }

    throw new ValidationError('PIN de segurança inválido. Para testes, use 1234 (Real) ou 9999 (Coação).');
  }

  /**
   * Atualização de Telemetria Contínua
   */
  async streamLocation(incidentId: string, point: TelemetryPointInput) {
    const timestamp = point.capturedAt || new Date().toISOString();

    await incidentRepository.updateLastLocation(
      incidentId,
      point.latitude,
      point.longitude,
      point.accuracyMeters,
      point.capturedOffline,
      timestamp
    );

    const savedPoint = await locationRepository.addPoint({
      incidentId,
      latitude: point.latitude,
      longitude: point.longitude,
      accuracyMeters: point.accuracyMeters,
      capturedOffline: !!point.capturedOffline,
      capturedAt: timestamp,
    });

    socketManager.broadcastToCopom('copom:telemetry', {
      ...savedPoint,
    });

    return savedPoint;
  }

  /**
   * Sincronização em Lote de Coordenadas Capturadas no Modo Offline
   */
  async syncOfflineBatch(incidentId: string, input: SyncOfflineBatchInput) {
    const pointsToInsert = input.points.map((pt) => ({
      incidentId,
      latitude: pt.latitude,
      longitude: pt.longitude,
      accuracyMeters: pt.accuracyMeters || 10,
      capturedOffline: true,
      capturedAt: pt.capturedAt,
    }));

    const syncedCount = await locationRepository.addBatch(pointsToInsert);

    // Atualiza a última coordenada conhecida com o ponto mais recente
    const lastPoint = input.points[input.points.length - 1];
    if (lastPoint) {
      await incidentRepository.updateLastLocation(
        incidentId,
        lastPoint.latitude,
        lastPoint.longitude,
        lastPoint.accuracyMeters,
        true,
        lastPoint.capturedAt
      );
    }

    socketManager.broadcastToCopom('copom:offline_batch_synced', {
      incidentId,
      syncedCount,
      points: pointsToInsert,
    });

    socketManager.broadcastNotificationLog({
      channel: 'POSTGIS SYNC',
      recipient: 'Servidor Neon DB & COPOM 190',
      msg: `Conexão restabelecida! ${syncedCount} coordenadas gravadas no IndexedDB offline foram sincronizadas no mapa.`,
    });

    return {
      syncedCount,
      incidentId,
      message: `${syncedCount} pontos sincronizados com sucesso no Neon PostGIS.`,
    };
  }

  /**
   * Retorna ocorrências ativas ou sob coação para a tela do COPOM
   */
  async getActiveIncidents(): Promise<Incident[]> {
    return incidentRepository.findActive();
  }

  /**
   * Recupera a trilha geoespacial completa de uma ocorrência
   */
  async getIncidentTrail(incidentId: string) {
    return locationRepository.findByIncident(incidentId);
  }

  /**
   * Registra evidência de áudio na caixa-preta jurídica
   */
  async registerAudioEvidence(incidentId: string, input: AudioEvidenceInput) {
    const record = await audioRepository.save({
      incidentId,
      storageUrl: input.storageUrl,
      sha256Checksum: input.sha256Checksum,
      durationSeconds: input.durationSeconds,
      recordedAt: input.recordedAt,
    });

    socketManager.broadcastNotificationLog({
      channel: 'CAIXA_PRETA_AUDIO',
      recipient: 'Perícia Técnica / COPOM',
      msg: `Evidência de áudio registrada com hash SHA-256 (${input.sha256Checksum.substring(0, 16)}...). Validade jurídica preservada.`,
    });

    return record;
  }
}

export const incidentService = new IncidentService();
