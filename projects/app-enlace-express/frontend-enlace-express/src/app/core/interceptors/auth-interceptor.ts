import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { SessionTokens } from '../models/auth.model';
import { AuthService } from '../services/auth-service';
import { SessionStore } from '../services/session-store';

let refreshInFlight: Observable<SessionTokens> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionStore);
  const auth = inject(AuthService);
  const router = inject(Router);
  const isPublicAuthCall = /\/sesion\/(login|refresh|logout)(\?|$)/.test(req.url);
  const token = session.accessToken();
  const request = token && !isPublicAuthCall
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || isPublicAuthCall) {
        return throwError(() => error);
      }
      if (!session.authEnabled) {
        return throwError(() => error);
      }
      if (!session.refreshToken()) {
        redirectToLogin(session, router);
        return throwError(() => error);
      }

      refreshInFlight ??= auth.refresh().pipe(
        catchError((refreshError: unknown) => {
          redirectToLogin(session, router);
          return throwError(() => refreshError);
        }),
        finalize(() => {
          refreshInFlight = null;
        }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

      return refreshInFlight.pipe(
        switchMap(() => {
          const renewed = session.accessToken();
          const retried = req.clone({
            setHeaders: renewed ? { Authorization: `Bearer ${renewed}` } : {},
          });
          return next(retried);
        }),
      );
    }),
  );
};

function redirectToLogin(session: SessionStore, router: Router): void {
  session.clear();
  const returnUrl = router.url.startsWith('/login') ? '/construir' : router.url;
  void router.navigate(['/login'], { queryParams: { returnUrl } });
}