import { Inject, Injectable } from '@nestjs/common';
import { CompanyNotFoundException } from '../../../companies/domain/exceptions/company-not-found.exception.js';
import {
  COMPANY_REPOSITORY,
  type ICompanyRepository,
} from '../../../companies/domain/interfaces/company-repository.interface.js';
import { InvoiceNumberAlreadyExistsException } from '../../domain/exceptions/invoice-number-already-exists.exception.js';
import { Invoice } from '../../domain/entities/invoice.entity.js';
import {
  INVOICE_REPOSITORY,
  type IInvoiceRepository,
} from '../../domain/interfaces/invoice-repository.interface.js';
import { CreateInvoiceDto } from '../dto/create-invoice.dto.js';
import { InvoiceMapper } from '../mappers/invoice.mapper.js';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: IInvoiceRepository,
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(dto: CreateInvoiceDto) {
    const company = await this.companyRepository.findById(dto.companyId);
    if (!company) {
      throw new CompanyNotFoundException(dto.companyId);
    }

    const existing = await this.invoiceRepository.findByNumber(dto.number);
    if (existing) {
      throw new InvoiceNumberAlreadyExistsException(dto.number);
    }

    const invoice = Invoice.create({
      companyId: dto.companyId,
      number: dto.number,
      periodStart: new Date(dto.periodStart),
      periodEnd: new Date(dto.periodEnd),
      issueDate: new Date(dto.issueDate),
      subtotal: dto.subtotal,
      taxes: dto.taxes,
    });

    const created = await this.invoiceRepository.create(invoice);
    return InvoiceMapper.toResponse(created);
  }
}
