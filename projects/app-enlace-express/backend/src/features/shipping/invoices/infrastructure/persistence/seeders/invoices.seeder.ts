import { InvoiceModel } from '../models/invoice.model.js';
import { CompanyModel } from '../../../../companies/infrastructure/persistence/models/company.model.js';
import { InvoiceStatus } from '../../../domain/enums/invoice-status.enum.js';

export async function seedInvoices(): Promise<void> {
  const count = await InvoiceModel.count();
  if (count > 0) {
    return;
  }

  const companies = await CompanyModel.findAll({
    limit: 2,
    order: [['id', 'ASC']],
  });

  if (companies.length === 0) {
    return;
  }

  const records = [
    {
      companyId: companies[0].id,
      number: 'FAC-2026-0001',
      periodStart: '2026-08-01',
      periodEnd: '2026-08-31',
      issueDate: '2026-09-01',
      subtotal: 450000,
      taxes: 85500,
      total: 535500,
      status: InvoiceStatus.PENDING,
      paymentDate: null,
    },
  ];

  if (companies[1]) {
    records.push({
      companyId: companies[1].id,
      number: 'FAC-2026-0002',
      periodStart: '2026-08-01',
      periodEnd: '2026-08-31',
      issueDate: '2026-09-01',
      subtotal: 210000,
      taxes: 39900,
      total: 249900,
      status: InvoiceStatus.PENDING,
      paymentDate: null,
    });
  }

  await InvoiceModel.bulkCreate(records);
}
