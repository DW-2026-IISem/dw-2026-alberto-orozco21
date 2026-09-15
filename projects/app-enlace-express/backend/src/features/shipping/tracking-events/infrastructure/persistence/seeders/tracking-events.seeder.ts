import { TrackingEventModel } from '../models/tracking-event.model.js';
import { ShipmentModel } from '../../../../shipments/infrastructure/persistence/models/shipment.model.js';
import { TrackingEventType } from '../../../domain/enums/tracking-event-type.enum.js';
import { TrackingEventSeverity } from '../../../domain/enums/tracking-event-severity.enum.js';

export async function seedTrackingEvents(): Promise<void> {
  const count = await TrackingEventModel.count();
  if (count > 0) {
    return;
  }

  const shipment = await ShipmentModel.findOne({ order: [['id', 'ASC']] });
  if (!shipment) {
    return;
  }

  await TrackingEventModel.bulkCreate([
    {
      shipmentId: shipment.id,
      type: TrackingEventType.PICKED_UP,
      eventDate: new Date(),
      location: 'Bodega norte, Barranquilla',
      observations: 'Envío recogido en el origen',
      severity: TrackingEventSeverity.INFO,
    },
  ]);
}
