import { PackageModel } from '../models/package.model.js';
import { ShipmentModel } from '../../../../shipments/infrastructure/persistence/models/shipment.model.js';

export async function seedPackages(): Promise<void> {
  const count = await PackageModel.count();
  if (count > 0) {
    return;
  }

  const shipment = await ShipmentModel.findOne({ order: [['id', 'ASC']] });
  if (!shipment) {
    return;
  }

  await PackageModel.bulkCreate([
    {
      shipmentId: shipment.id,
      contentDescription: 'Repuestos electrónicos',
      weightKg: 3.5,
      heightCm: 20,
      widthCm: 15,
      lengthCm: 25,
      declaredValue: 120000,
      isFragile: true,
      isActive: true,
    },
    {
      shipmentId: shipment.id,
      contentDescription: 'Documentos',
      weightKg: 1.5,
      heightCm: 5,
      widthCm: 25,
      lengthCm: 35,
      declaredValue: 30000,
      isFragile: false,
      isActive: true,
    },
  ]);
}
