import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { apiRouter } from './presentation/routes';
import { errorHandler } from './presentation/middlewares/errorHandler';
import { requestLogger } from './presentation/middlewares/requestLogger';

export function createApp() {
  const app = express();

  // Middlewares de Segurança e Parsing
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Middleware de Log Estruturado
  app.use(requestLogger);

  // Prefixo Global da API
  app.use('/api/v1', apiRouter);

  // Rota de Healthcheck na raiz
  app.get('/', (_req, res) => {
    res.json({
      message: 'SOS Mulheres API - Clean Architecture & Neon Serverless PostgreSQL',
      docs: '/api/v1/health',
      version: '1.0.0',
    });
  });

  // Middleware Central de Tratamento de Erros
  app.use(errorHandler);

  return app;
}
