import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';
import { toApiMessage } from '../utils/api-error';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 403) {
          notifications.error('Acceso denegado', toApiMessage(error));
        } else if (error.status === 0 || error.status >= 500) {
          notifications.error('Error de conexión', toApiMessage(error));
        }
      }
      return throwError(() => error);
    }),
  );
};