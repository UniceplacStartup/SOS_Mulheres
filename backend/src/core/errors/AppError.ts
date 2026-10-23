/**
 * Hierarquia de Exceções de Domínio e Aplicação
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode = 400, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id?: string) {
    super(`${entity} ${id ? `identificado por '${id}' ` : ''}não foi encontrado(a).`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 422, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Credenciais inválidas ou acesso não autorizado.') {
    super(message, 401);
  }
}

export class DuressSecurityAlert extends AppError {
  constructor(message = 'Alerta de coação silenciosa acionado.') {
    super(message, 200); // Retorna 200 para dissimular na interface do invasor
  }
}
