import { HttpErrorResponse } from '@angular/common/http';
import { toApiMessage } from './api-error';

describe('toApiMessage', () => {
  it('should explain that the backend is unreachable for status zero', () => {
    const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    expect(toApiMessage(error)).toContain('No se pudo conectar con el backend');
  });

  it('should keep RBAC details opaque for a 403', () => {
    const error = new HttpErrorResponse({
      status: 403,
      statusText: 'Forbidden',
      error: { error: 'Forbidden', detail: 'internal permission path' },
    });
    expect(toApiMessage(error)).toBe('No tienes permiso para realizar esta acción.');
  });

  it('should combine the backend error and detail from JSON', () => {
    const error = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: { error: 'Validation error', detail: 'nit is required' },
    });
    expect(toApiMessage(error)).toBe('Validation error — nit is required');
  });

  it('should return plain text and handle unknown values', () => {
    const error = new HttpErrorResponse({ status: 500, error: 'Service unavailable' });
    expect(toApiMessage(error)).toBe('Service unavailable');
    expect(toApiMessage(null)).toBe('Error inesperado');
  });
});