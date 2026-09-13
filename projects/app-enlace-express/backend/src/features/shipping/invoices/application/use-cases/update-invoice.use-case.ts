import { Inject, Injectable } from '@nestjs/common';
import { InvoiceNotFoundException } from '../../domain/exceptions/invoice-not-found.exception.js';
import {
  INVOICE_REPOSITORY,
  type IInvoiceRepository,
} from '../../domain/interfaces/invoice-repository.interface.js';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto.js';
import { InvoiceMapper } from '../mappers/invoice.mapper.js';

@Injectable()
export class UpdateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(id: number, dto: UpdateInvoiceDto) {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new InvoiceNotFoundException(id);
    }

    invoice.update({
      periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
      periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
      issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
      subtotal: dto.subtotal,
      taxes: dto.taxes,
    });

    const updated = await this.invoiceRepository.update(invoice);
    return InvoiceMapper.toResponse(updated);
  }
}
