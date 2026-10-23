import { Request, Response, NextFunction } from 'express';
import { incidentService } from '../../application/services/IncidentService';
import {
  triggerSosSchema,
  terminateIncidentSchema,
  telemetryPointSchema,
  syncOfflineBatchSchema,
  audioEvidenceSchema,
} from '../../application/dtos';

export class IncidentController {
  async triggerSos(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = triggerSosSchema.parse(req.body);
      const incident = await incidentService.triggerSos(validated);
      return res.status(201).json({
        success: true,
        data: incident,
      });
    } catch (error) {
      next(error);
    }
  }

  async terminateIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = terminateIncidentSchema.parse(req.body);
      const result = await incidentService.terminateIncident(id, validated);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async streamLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = telemetryPointSchema.parse(req.body);
      const log = await incidentService.streamLocation(id, validated);
      return res.status(200).json({
        success: true,
        data: log,
      });
    } catch (error) {
      next(error);
    }
  }

  async syncOfflineBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = syncOfflineBatchSchema.parse(req.body);
      const result = await incidentService.syncOfflineBatch(id, validated);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveIncidents(_req: Request, res: Response, next: NextFunction) {
    try {
      const incidents = await incidentService.getActiveIncidents();
      return res.status(200).json({
        success: true,
        data: incidents,
      });
    } catch (error) {
      next(error);
    }
  }

  async getIncidentTrail(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const trail = await incidentService.getIncidentTrail(id);
      return res.status(200).json({
        success: true,
        data: trail,
      });
    } catch (error) {
      next(error);
    }
  }

  async saveAudioEvidence(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validated = audioEvidenceSchema.parse(req.body);
      const evidence = await incidentService.registerAudioEvidence(id, validated);
      return res.status(201).json({
        success: true,
        data: evidence,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const incidentController = new IncidentController();
