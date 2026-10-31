import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DeliveryProof, DeliveryProofPayload } from '../../core/models/delivery-proof.model';

/** /delivery_proofs — la lista llega en `{ delivery_proofs }` y el detalle en `{ delivery_proof }`. */
@Injectable({ providedIn: 'root' })
export class DeliveryProofApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/delivery_proofs`;

  list(): Observable<DeliveryProof[]> {
    return this.http
      .get<{ delivery_proofs: DeliveryProof[] }>(this.base)
      .pipe(map((response) => response.delivery_proofs));
  }

  get(id: number): Observable<DeliveryProof> {
    return this.http
      .get<{ delivery_proof: DeliveryProof }>(`${this.base}/${id}`)
      .pipe(map((response) => response.delivery_proof));
  }

  create(payload: DeliveryProofPayload): Observable<DeliveryProof> {
    return this.http
      .post<{ delivery_proof: DeliveryProof }>(this.base, payload)
      .pipe(map((response) => response.delivery_proof));
  }

  update(id: number, payload: Partial<DeliveryProofPayload>): Observable<DeliveryProof> {
    return this.http
      .patch<{ delivery_proof: DeliveryProof }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.delivery_proof));
  }

  replace(id: number, payload: DeliveryProofPayload): Observable<DeliveryProof> {
    return this.http
      .put<{ delivery_proof: DeliveryProof }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.delivery_proof));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
