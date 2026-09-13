import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { InvoiceStatus } from '../enums/invoice-status.enum.js';
import { Invoice } from '../entities/invoice.entity.js';

export const INVOICE_REPOSITORY = 'INVOICE_REPOSITORY';

export interface InvoiceFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: number;
  status?: InvoiceStatus;
}

export interface IInvoiceRepository {
  create(invoice: Invoice): Promise<Invoice>;
  update(invoice: Invoice): Promise<Invoice>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Invoice | null>;
  findByNumber(number: string): Promise<Invoice | null>;
  findAll(params: InvoiceFindAllParams): Promise<PaginatedResult<Invoice>>;
}
