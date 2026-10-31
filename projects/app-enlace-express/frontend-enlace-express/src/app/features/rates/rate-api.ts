import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Rate, RatePayload } from '../../core/models/rate.model';

/** /rates — la lista llega en `{ rates }` y el detalle en `{ rate }`. */
@Injectable({ providedIn: 'root' })
export class RateApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/rates`;

  list(): Observable<Rate[]> {
    return this.http
      .get<{ rates: Rate[] }>(this.base)
      .pipe(map((response) => response.rates));
  }

  get(id: number): Observable<Rate> {
    return this.http
      .get<{ rate: Rate }>(`${this.base}/${id}`)
      .pipe(map((response) => response.rate));
  }

  create(payload: RatePayload): Observable<Rate> {
    return this.http
      .post<{ rate: Rate }>(this.base, payload)
      .pipe(map((response) => response.rate));
  }

  update(id: number, payload: Partial<RatePayload>): Observable<Rate> {
    return this.http
      .patch<{ rate: Rate }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.rate));
  }

  replace(id: number, payload: RatePayload): Observable<Rate> {
    return this.http
      .put<{ rate: Rate }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.rate));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
