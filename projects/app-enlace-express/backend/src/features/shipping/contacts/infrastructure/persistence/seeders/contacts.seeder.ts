import { ContactModel } from '../models/contact.model.js';
import { CompanyModel } from '../../../../companies/infrastructure/persistence/models/company.model.js';

export async function seedContacts(): Promise<void> {
  const count = await ContactModel.count();
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
      name: 'Laura Gómez',
      position: 'Gerente de Logística',
      phone: '+57 301 2223344',
      email: 'laura.gomez@example.com',
      isPrimary: true,
      isActive: true,
    },
  ];

  if (companies[1]) {
    records.push({
      companyId: companies[1].id,
      name: 'Carlos Ruiz',
      position: 'Coordinador de Compras',
      phone: '+57 315 5556677',
      email: 'carlos.ruiz@example.com',
      isPrimary: true,
      isActive: true,
    });
  }

  await ContactModel.bulkCreate(records);
}
