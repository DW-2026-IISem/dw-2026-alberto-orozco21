import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Messenger, MessengerPayload } from '../../core/models/messenger.model';

/** /messengers — la lista llega en `{ messengers }` y el detalle en `{ messenger }`. */
@Injectable({ providedIn: 'root' })
export class MessengerApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/messengers`;

  list(): Observable<Messenger[]> {
    return this.http
      .get<{ messengers: Messenger[] }>(this.base)
      .pipe(map((response) => response.messengers));
  }

  get(id: number): Observable<Messenger> {
    return this.http
      .get<{ messenger: Messenger }>(`${this.base}/${id}`)
      .pipe(map((response) => response.messenger));
  }

  create(payload: MessengerPayload): Observable<Messenger> {
    return this.http
      .post<{ messenger: Messenger }>(this.base, payload)
      .pipe(map((response) => response.messenger));
  }

  update(id: number, payload: Partial<MessengerPayload>): Observable<Messenger> {
    return this.http
      .patch<{ messenger: Messenger }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.messenger));
  }

  replace(id: number, payload: MessengerPayload): Observable<Messenger> {
    return this.http
      .put<{ messenger: Messenger }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.messenger));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
