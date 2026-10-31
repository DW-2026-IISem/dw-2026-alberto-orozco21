import { HttpErrorResponse } from '@angular/common/http';

export function toApiMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { error?: string; detail?: string } | string | null;

    if (error.status === 0) {
      const endpoint = error.url ? ` Solicitud: ${error.url}.` : '';
      return `No se pudo conectar con el backend. Verifica que esté en http://localhost:4000.${endpoint}`;
    }
    if (error.status === 403) {
      return 'No tienes permiso para realizar esta acción.';
    }
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object' && body.error) {
      return body.detail ? `${body.error} — ${body.detail}` : body.error;
    }
    return error.message;
  }

  return error instanceof Error ? error.message : 'Error inesperado';
}
