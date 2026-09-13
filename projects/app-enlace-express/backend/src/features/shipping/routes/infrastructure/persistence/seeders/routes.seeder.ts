import { RouteModel } from '../models/route.model.js';
import { CourierModel } from '../../../../couriers/infrastructure/persistence/models/courier.model.js';
import { RouteStatus } from '../../../domain/enums/route-status.enum.js';

export async function seedRoutes(): Promise<void> {
  const count = await RouteModel.count();
  if (count > 0) {
    return;
  }

  const couriers = await CourierModel.findAll({
    limit: 2,
    order: [['id', 'ASC']],
  });

  if (couriers.length === 0) {
    return;
  }

  const records = [
    {
      courierId: couriers[0].id,
      name: 'Ruta matutina norte',
      coverageZone: 'Barranquilla Norte',
      date: '2026-09-15',
      startTime: new Date('2026-09-15T08:00:00Z'),
      endTime: new Date('2026-09-15T12:00:00Z'),
      status: RouteStatus.PLANNED,
      isActive: true,
    },
  ];

  if (couriers[1]) {
    records.push({
      courierId: couriers[1].id,
      name: 'Ruta vespertina centro',
      coverageZone: 'Barranquilla Centro',
      date: '2026-09-15',
      startTime: new Date('2026-09-15T13:00:00Z'),
      endTime: new Date('2026-09-15T17:00:00Z'),
      status: RouteStatus.PLANNED,
      isActive: true,
    });
  }

  await RouteModel.bulkCreate(records);
}
