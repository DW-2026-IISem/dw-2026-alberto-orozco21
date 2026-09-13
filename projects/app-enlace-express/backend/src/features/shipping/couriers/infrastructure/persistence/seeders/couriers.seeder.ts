import { CourierModel } from '../models/courier.model.js';
import { VehicleType } from '../../../domain/enums/vehicle-type.enum.js';

export async function seedCouriers(): Promise<void> {
  const count = await CourierModel.count();
  if (count > 0) {
    return;
  }

  await CourierModel.bulkCreate([
    {
      name: 'Jorge Martínez',
      documentId: '1042567890',
      phone: '+57 300 1112233',
      vehicleType: VehicleType.MOTORCYCLE,
      licensePlate: 'ABC12D',
      assignedZone: 'Barranquilla Norte',
      isActive: true,
    },
    {
      name: 'Andrea Torres',
      documentId: '1098765432',
      phone: '+57 312 4445566',
      vehicleType: VehicleType.BICYCLE,
      licensePlate: null,
      assignedZone: 'Barranquilla Centro',
      isActive: true,
    },
  ]);
}
