import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Address, AddressPayload } from '../../core/models/address.model';

/** /address — la lista llega en `{ addresses }` y el detalle en `{ address }`. */
@Injectable({ providedIn: 'root' })
export class AddressApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/address`;

  list(): Observable<Address[]> {
    return this.http
      .get<{ addresses: Address[] }>(this.base)
      .pipe(map((response) => response.addresses));
  }

  get(id: number): Observable<Address> {
    return this.http
      .get<{ address: Address }>(`${this.base}/${id}`)
      .pipe(map((response) => response.address));
  }

  create(payload: AddressPayload): Observable<Address> {
    return this.http
      .post<{ address: Address }>(this.base, payload)
      .pipe(map((response) => response.address));
  }

  update(id: number, payload: Partial<AddressPayload>): Observable<Address> {
    return this.http
      .patch<{ address: Address }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.address));
  }

  replace(id: number, payload: AddressPayload): Observable<Address> {
    return this.http
      .put<{ address: Address }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.address));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
