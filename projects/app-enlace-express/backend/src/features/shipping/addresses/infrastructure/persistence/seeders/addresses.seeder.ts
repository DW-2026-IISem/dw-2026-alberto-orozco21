import { AddressModel } from '../models/address.model.js';
import { CompanyModel } from '../../../../companies/infrastructure/persistence/models/company.model.js';
import { AddressType } from '../../../domain/enums/address-type.enum.js';

export async function seedAddresses(): Promise<void> {
  const count = await AddressModel.count();
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
      alias: 'Bodega norte',
      addressLine1: 'Cra 45 # 98-20',
      city: 'Barranquilla',
      state: 'Atlántico',
      country: 'Colombia',
      postalCode: '080020',
      latitude: 11.0184,
      longitude: -74.8508,
      type: AddressType.MIXED,
      isActive: true,
    },
  ];

  if (companies[1]) {
    records.push({
      companyId: companies[1].id,
      alias: 'Oficina principal',
      addressLine1: 'Calle 72 # 10-34',
      city: 'Bogotá',
      state: 'Cundinamarca',
      country: 'Colombia',
      postalCode: '110221',
      latitude: 4.711,
      longitude: -74.0721,
      type: AddressType.PICKUP,
      isActive: true,
    });
  }

  await AddressModel.bulkCreate(records);
}
