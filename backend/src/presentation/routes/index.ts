import { Router } from 'express';
import { incidentRoutes } from './incidentRoutes';
import { authRoutes } from './authRoutes';
import { contactRoutes } from './contactRoutes';
import { checkDatabaseHealth } from '../../config/db';

export const apiRouter = Router();

apiRouter.use('/incidents', incidentRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/contacts', contactRoutes);

apiRouter.get('/health', async (_req, res) => {
  const dbHealth = await checkDatabaseHealth();
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    service: 'SOS Mulheres API - Clean Architecture',
    database: dbHealth,
    environment: process.env.NODE_ENV || 'development',
  });
});
