import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../core/errors/AppError';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        details: err.details || null,
      },
    });
  }

  if (err instanceof ZodError) {
    const formatted = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(422).json({
      success: false,
      error: {
        message: 'Dados de entrada inválidos',
        validationErrors: formatted,
      },
    });
  }

  console.error('🔥 [Unhandled Error]:', err);

  return res.status(500).json({
    success: false,
    error: {
      message: 'Erro interno no servidor. Tente novamente em instantes.',
    },
  });
}
