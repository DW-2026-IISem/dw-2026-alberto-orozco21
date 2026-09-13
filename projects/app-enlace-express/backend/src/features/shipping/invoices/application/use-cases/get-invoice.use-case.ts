import { Inject, Injectable } from '@nestjs/common';
import { InvoiceNotFoundException } from '../../domain/exceptions/invoice-not-found.exception.js';
import {
  INVOICE_REPOSITORY,
  type IInvoiceRepository,
} from '../../domain/interfaces/invoice-repository.interface.js';
import { InvoiceMapper } from '../mappers/invoice.mapper.js';

@Injectable()
export class GetInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(id: number) {
    const invoice = await this.invoiceRepository.findById(id);
    if (!invoice) {
      throw new InvoiceNotFoundException(id);
    }

    return InvoiceMapper.toResponse(invoice);
  }
}
