import { ProofOfDeliveryModel } from '../models/proof-of-delivery.model.js';
import { ShipmentModel } from '../../../../shipments/infrastructure/persistence/models/shipment.model.js';
import { ShipmentStatus } from '../../../../shipments/domain/enums/shipment-status.enum.js';

export async function seedProofsOfDelivery(): Promise<void> {
  const count = await ProofOfDeliveryModel.count();
  if (count > 0) {
    return;
  }

  const shipment = await ShipmentModel.findOne({
    where: { status: ShipmentStatus.IN_TRANSIT },
    order: [['id', 'ASC']],
  });

  if (!shipment) {
    // No hay envíos en_ruta en los datos sembrados; se omite el seeder.
    return;
  }

  await ProofOfDeliveryModel.create({
    shipmentId: shipment.id,
    deliveredAt: new Date(),
    receiverName: 'Recepción Bodega Central',
    receiverDocument: '1122334455',
    photoUrl: 'https://example.com/evidence/photo.jpg',
    observations: 'Entregado sin novedad',
  });
}
