import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RoleUser, RoleUserPayload } from '../../../core/models/role-user.model';

@Injectable({ providedIn: 'root' })
export class RoleUserApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/asignaciones-rol`;

  list(): Observable<RoleUser[]> {
    return this.http
      .get<{ assignments: RoleUser[] }>(this.base)
      .pipe(map((response) => response.assignments));
  }

  get(id: number): Observable<RoleUser> {
    return this.http
      .get<{ assignment: RoleUser }>(`${this.base}/${id}`)
      .pipe(map((response) => response.assignment));
  }

  create(payload: RoleUserPayload): Observable<RoleUser> {
    return this.http
      .post<{ assignment: RoleUser }>(this.base, payload)
      .pipe(map((response) => response.assignment));
  }

  deactivate(id: number): Observable<RoleUser> {
    return this.http
      .patch<{ assignment: RoleUser }>(`${this.base}/${id}/deactivate`, {})
      .pipe(map((response) => response.assignment));
  }

  reactivate(id: number): Observable<RoleUser> {
    return this.http
      .patch<{ assignment: RoleUser }>(`${this.base}/${id}/reactivate`, {})
      .pipe(map((response) => response.assignment));
  }
}