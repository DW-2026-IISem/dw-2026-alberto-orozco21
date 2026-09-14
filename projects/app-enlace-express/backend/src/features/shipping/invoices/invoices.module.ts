import { Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module.js';
import { INVOICE_REPOSITORY } from './domain/interfaces/invoice-repository.interface.js';
import { InvoiceRepository } from './infrastructure/persistence/repositories/invoice.repository.js';
import { CreateInvoiceUseCase } from './application/use-cases/create-invoice.use-case.js';
import { UpdateInvoiceUseCase } from './application/use-cases/update-invoice.use-case.js';
import { DeleteInvoiceUseCase } from './application/use-cases/delete-invoice.use-case.js';
import { GetInvoiceUseCase } from './application/use-cases/get-invoice.use-case.js';
import { ListInvoicesUseCase } from './application/use-cases/list-invoices.use-case.js';
import { MarkInvoicePaidUseCase } from './application/use-cases/mark-invoice-paid.use-case.js';
import { VoidInvoiceUseCase } from './application/use-cases/void-invoice.use-case.js';
import { InvoicesController } from './presentation/http/controllers/invoices.controller.js';

@Module({
  imports: [CompaniesModule],
  controllers: [InvoicesController],
  providers: [
    InvoiceRepository,
    { provide: INVOICE_REPOSITORY, useExisting: InvoiceRepository },
    CreateInvoiceUseCase,
    UpdateInvoiceUseCase,
    DeleteInvoiceUseCase,
    GetInvoiceUseCase,
    ListInvoicesUseCase,
    MarkInvoicePaidUseCase,
    VoidInvoiceUseCase,
  ],
  exports: [INVOICE_REPOSITORY],
})
export class InvoicesModule {}
