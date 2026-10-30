import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EffectivePermission, SessionTokens, UserSession } from '../../core/models/auth.model';
import { User } from '../../core/models/user.model';

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RefreshPayload {
  refresh_token: string;
}

@Injectable({ providedIn: 'root' })
export class SessionApi {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  login(payload: LoginPayload): Observable<SessionTokens> {
    return this.http.post<SessionTokens>(`${this.base}/sesion/login`, payload);
  }

  refresh(payload: RefreshPayload): Observable<SessionTokens> {
    return this.http.post<SessionTokens>(`${this.base}/sesion/refresh`, payload);
  }

  logout(payload: RefreshPayload): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/sesion/logout`, payload);
  }

  profile(): Observable<User> {
    return this.http
      .get<{ user: User }>(`${this.base}/sesion/perfil`)
      .pipe(map((response) => response.user));
  }

  permissions(): Observable<EffectivePermission[]> {
    return this.http
      .get<{ permissions: EffectivePermission[] }>(`${this.base}/permisos`)
      .pipe(map((response) => response.permissions));
  }

  listSessions(): Observable<UserSession[]> {
    return this.http
      .get<{ sessions: UserSession[] }>(`${this.base}/sesiones`)
      .pipe(map((response) => response.sessions));
  }

  getSession(id: number): Observable<UserSession> {
    return this.http
      .get<{ session: UserSession }>(`${this.base}/sesiones/${id}`)
      .pipe(map((response) => response.session));
  }

  deactivateAllSessions(): Observable<{ message: string; revoked: number }> {
    return this.http.patch<{ message: string; revoked: number }>(
      `${this.base}/sesiones/deactivate-all`,
      {},
    );
  }

  deactivateSession(id: number): Observable<{ message: string; session: UserSession }> {
    return this.http.patch<{ message: string; session: UserSession }>(
      `${this.base}/sesiones/${id}/deactivate`,
      {},
    );
  }

  purgeInactiveSessions(): Observable<{ message: string; purged: number }> {
    return this.http.delete<{ message: string; purged: number }>(`${this.base}/sesiones`);
  }
}