import { Inject, Injectable } from '@nestjs/common';
import { InvoiceStatus } from '../../domain/enums/invoice-status.enum.js';
import { InvoiceNotFoundException } from '../../domain/exceptions/invoice-not-found.exception.js';
import {
  INVOICE_REPOSITORY,
  type IInvoiceRepository,
} from '../../domain/interfaces/invoice-repository.interface.js';

@Injectable()
export class DeleteInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new InvoiceNotFoundException(id);
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new Error('No se puede eliminar una factura ya pagada');
    }

    await this.invoiceRepository.delete(id);
  }
}
