import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, forkJoin, map, of, switchMap, tap, throwError } from 'rxjs';
import { AccessPayload, LoginRequest, SessionTokens } from '../models/auth.model';
import { SessionApi } from '../../features/auth/session-api';
import { SessionStore } from './session-store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(SessionApi);
  private readonly session = inject(SessionStore);

  login(credentials: LoginRequest): Observable<AccessPayload> {
    return this.api.login(credentials).pipe(
      tap((tokens) => this.session.setTokens(tokens)),
      switchMap(() =>
        this.me().pipe(
          catchError((error: unknown) => {
            this.session.clear();
            return throwError(() => error);
          }),
        ),
      ),
    );
  }

  me(): Observable<AccessPayload> {
    return forkJoin({ user: this.api.profile(), permissions: this.api.permissions() }).pipe(
      tap((access) => this.session.setAccess(access)),
    );
  }

  refresh(): Observable<SessionTokens> {
    const refresh_token = this.session.refreshToken();
    if (!refresh_token) {
      return throwError(() => new Error('No hay refresh token en la sesión'));
    }
    return this.api.refresh({ refresh_token }).pipe(
      tap((tokens) => this.session.setTokens(tokens)),
    );
  }

  logout(): Observable<unknown> {
    const refresh_token = this.session.refreshToken();
    return this.api.logout({ refresh_token: refresh_token ?? '' }).pipe(
      catchError(() => of(null)),
      finalize(() => this.session.clear()),
    );
  }
}