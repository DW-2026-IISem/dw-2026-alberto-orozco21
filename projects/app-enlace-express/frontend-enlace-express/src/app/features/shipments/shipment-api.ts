import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Shipment, ShipmentPayload } from '../../core/models/shipment.model';

/** /shipments — la lista llega en `{ shipments }` y el detalle en `{ shipment }`. */
@Injectable({ providedIn: 'root' })
export class ShipmentApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/shipments`;

  list(): Observable<Shipment[]> {
    return this.http
      .get<{ shipments: Shipment[] }>(this.base)
      .pipe(map((response) => response.shipments));
  }

  get(id: number): Observable<Shipment> {
    return this.http
      .get<{ shipment: Shipment }>(`${this.base}/${id}`)
      .pipe(map((response) => response.shipment));
  }

  create(payload: ShipmentPayload): Observable<Shipment> {
    return this.http
      .post<{ shipment: Shipment }>(this.base, payload)
      .pipe(map((response) => response.shipment));
  }

  update(id: number, payload: Partial<ShipmentPayload>): Observable<Shipment> {
    return this.http
      .patch<{ shipment: Shipment }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.shipment));
  }

  replace(id: number, payload: ShipmentPayload): Observable<Shipment> {
    return this.http
      .put<{ shipment: Shipment }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.shipment));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
