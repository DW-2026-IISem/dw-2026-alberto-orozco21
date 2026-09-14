import { ShipmentModel } from '../models/shipment.model.js';
import { CompanyModel } from '../../../../companies/infrastructure/persistence/models/company.model.js';
import { ContactModel } from '../../../../contacts/infrastructure/persistence/models/contact.model.js';
import { AddressModel } from '../../../../addresses/infrastructure/persistence/models/address.model.js';
import { RateModel } from '../../../../rates/infrastructure/persistence/models/rate.model.js';
import { ShipmentPriority } from '../../../domain/enums/shipment-priority.enum.js';
import { ShipmentStatus } from '../../../domain/enums/shipment-status.enum.js';
import { Shipment } from '../../../domain/entities/shipment.entity.js';

export async function seedShipments(): Promise<void> {
  const count = await ShipmentModel.count();
  if (count > 0) {
    return;
  }

  const company = await CompanyModel.findOne({ order: [['id', 'ASC']] });
  const contact = await ContactModel.findOne({ order: [['id', 'ASC']] });
  const address = await AddressModel.findOne({ order: [['id', 'ASC']] });
  const rate = await RateModel.findOne({ order: [['id', 'ASC']] });

  if (!company || !contact || !address || !rate) {
    return;
  }

  await ShipmentModel.create({
    guideNumber: Shipment.generateGuideNumber(),
    companyId: company.id,
    originContactId: contact.id,
    originAddressId: address.id,
    destinationContactId: contact.id,
    destinationAddressId: address.id,
    rateId: rate.id,
    priority: ShipmentPriority.NORMAL,
    totalWeightKg: 5,
    declaredValue: 150000,
    status: ShipmentStatus.CREATED,
    requestDate: new Date(),
    estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    isActive: true,
  });
}
