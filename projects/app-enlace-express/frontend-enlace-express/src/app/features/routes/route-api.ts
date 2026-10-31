import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Route, RoutePayload } from '../../core/models/route.model';

/** /routes — la lista llega en `{ routes }` y el detalle en `{ route }`. */
@Injectable({ providedIn: 'root' })
export class RouteApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/routes`;

  list(): Observable<Route[]> {
    return this.http
      .get<{ routes: Route[] }>(this.base)
      .pipe(map((response) => response.routes));
  }

  get(id: number): Observable<Route> {
    return this.http
      .get<{ route: Route }>(`${this.base}/${id}`)
      .pipe(map((response) => response.route));
  }

  create(payload: RoutePayload): Observable<Route> {
    return this.http
      .post<{ route: Route }>(this.base, payload)
      .pipe(map((response) => response.route));
  }

  update(id: number, payload: Partial<RoutePayload>): Observable<Route> {
    return this.http
      .patch<{ route: Route }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.route));
  }

  replace(id: number, payload: RoutePayload): Observable<Route> {
    return this.http
      .put<{ route: Route }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.route));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
