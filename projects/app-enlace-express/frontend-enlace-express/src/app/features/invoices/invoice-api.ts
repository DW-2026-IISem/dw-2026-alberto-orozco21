import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Invoice, InvoicePayload } from '../../core/models/invoice.model';

/** /invoices — la lista llega en `{ invoices }` y el detalle en `{ invoice }`. */
@Injectable({ providedIn: 'root' })
export class InvoiceApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/invoices`;

  list(): Observable<Invoice[]> {
    return this.http
      .get<{ invoices: Invoice[] }>(this.base)
      .pipe(map((response) => response.invoices));
  }

  get(id: number): Observable<Invoice> {
    return this.http
      .get<{ invoice: Invoice }>(`${this.base}/${id}`)
      .pipe(map((response) => response.invoice));
  }

  create(payload: InvoicePayload): Observable<Invoice> {
    return this.http
      .post<{ invoice: Invoice }>(this.base, payload)
      .pipe(map((response) => response.invoice));
  }

  update(id: number, payload: Partial<InvoicePayload>): Observable<Invoice> {
    return this.http
      .patch<{ invoice: Invoice }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.invoice));
  }

  replace(id: number, payload: InvoicePayload): Observable<Invoice> {
    return this.http
      .put<{ invoice: Invoice }>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response.invoice));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
