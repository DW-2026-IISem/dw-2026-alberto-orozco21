import { Inject, Injectable } from '@nestjs/common';
import { InvoiceNotFoundException } from '../../domain/exceptions/invoice-not-found.exception.js';
import {
  INVOICE_REPOSITORY,
  type IInvoiceRepository,
} from '../../domain/interfaces/invoice-repository.interface.js';
import { MarkInvoicePaidDto } from '../dto/mark-invoice-paid.dto.js';
import { InvoiceMapper } from '../mappers/invoice.mapper.js';

@Injectable()
export class MarkInvoicePaidUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(id: number, dto: MarkInvoicePaidDto) {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new InvoiceNotFoundException(id);
    }

    invoice.markAsPaid(dto.paymentDate ? new Date(dto.paymentDate) : undefined);

    const updated = await this.invoiceRepository.update(invoice);
    return InvoiceMapper.toResponse(updated);
  }
}
