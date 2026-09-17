import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationException } from '../exceptions/application.exception.js';

const SEQUELIZE_ERROR_STATUS: Record<string, number> = {
  SequelizeUniqueConstraintError: 409,
  SequelizeForeignKeyConstraintError: 400,
  SequelizeConnectionError: 503,
  SequelizeValidationError: 422,
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Error interno del servidor';

    if (exception instanceof ApplicationException) {
      status = exception.statusCode;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message;
    } else if (
      exception instanceof Error &&
      exception.name in SEQUELIZE_ERROR_STATUS
    ) {
      status = SEQUELIZE_ERROR_STATUS[exception.name];
      message = exception.message || 'Error de base de datos';
    } else if (exception instanceof Error && exception.constructor === Error) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
