import { Inject, Injectable } from '@nestjs/common';
import {
  INVOICE_REPOSITORY,
  type IInvoiceRepository,
} from '../../domain/interfaces/invoice-repository.interface.js';
import { InvoiceFilterDto } from '../dto/invoice-filter.dto.js';
import { InvoiceMapper } from '../mappers/invoice.mapper.js';

@Injectable()
export class ListInvoicesUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  async execute(filter: InvoiceFilterDto) {
    const result = await this.invoiceRepository.findAll(filter);
    return {
      items: result.items.map((invoice) => InvoiceMapper.toResponse(invoice)),
      meta: result.meta,
    };
  }
}
