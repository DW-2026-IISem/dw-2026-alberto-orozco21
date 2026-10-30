import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Invoice, InvoicePayload } from '../../core/models/invoice.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class InvoiceApi extends EntityApi<Invoice, InvoicePayload> {
  constructor() {
    super(`${environment.apiUrl}/invoices`, 'invoices', 'invoice');
  }
}