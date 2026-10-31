import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TrackingEvent, TrackingEventPayload } from '../../core/models/tracking-event.model';

/** /tracking_events — la lista llega en `{ tracking_events }` y el detalle en `{ tracking_event }`. */
@Injectable({ providedIn: 'root' })
export class TrackingEventApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tracking_events`;

  list(): Observable<TrackingEvent[]> {
    return this.http
      .get<{ tracking_events: TrackingEvent[] }>(this.base)
      .pipe(map((response) => response.tracking_events));
  }

  get(id: number): Observable<TrackingEvent> {
    return this.http
      .get<{ tracking_event: TrackingEvent }>(`${this.base}/${id}`)
      .pipe(map((response) => response.tracking_event));
  }

  create(payload: TrackingEventPayload): Observable<TrackingEvent> {
    return this.http
      .post<{ tracking_event: TrackingEvent }>(this.base, payload)
      .pipe(map((response) => response.tracking_event));
  }

  update(id: number, payload: Partial<TrackingEventPayload>): Observable<TrackingEvent> {
    return this.http
      .patch<{ tracking_event: TrackingEvent }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.tracking_event));
  }

  replace(id: number, payload: TrackingEventPayload): Observable<TrackingEvent> {
    return this.http
      .put<{ tracking_event: TrackingEvent }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.tracking_event));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
