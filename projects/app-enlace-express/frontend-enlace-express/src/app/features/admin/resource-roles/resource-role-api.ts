import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResourceRole, ResourceRolePayload } from '../../../core/models/resource-role.model';

export interface ResourceRoleFilters {
  role_id?: number;
  resource_id?: number;
}

@Injectable({ providedIn: 'root' })
export class ResourceRoleApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/concesiones-rol`;

  list(filters: ResourceRoleFilters = {}): Observable<ResourceRole[]> {
    let params = new HttpParams();
    if (filters.role_id !== undefined) params = params.set('role_id', filters.role_id);
    if (filters.resource_id !== undefined) params = params.set('resource_id', filters.resource_id);

    return this.http
      .get<{ grants: ResourceRole[] }>(this.base, { params })
      .pipe(map((response) => response.grants));
  }

  get(id: number): Observable<ResourceRole> {
    return this.http
      .get<{ grant: ResourceRole }>(`${this.base}/${id}`)
      .pipe(map((response) => response.grant));
  }

  create(payload: ResourceRolePayload): Observable<ResourceRole> {
    return this.http
      .post<{ grant: ResourceRole }>(this.base, payload)
      .pipe(map((response) => response.grant));
  }

  deactivate(id: number): Observable<ResourceRole> {
    return this.http
      .patch<{ grant: ResourceRole }>(`${this.base}/${id}/deactivate`, {})
      .pipe(map((response) => response.grant));
  }

  reactivate(id: number): Observable<ResourceRole> {
    return this.http
      .patch<{ grant: ResourceRole }>(`${this.base}/${id}/reactivate`, {})
      .pipe(map((response) => response.grant));
  }
}