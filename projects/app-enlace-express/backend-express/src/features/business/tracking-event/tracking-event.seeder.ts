import { faker } from "@faker-js/faker";
import { Messenger } from "../messenger/messenger.model";
import { Shipment } from "../shipment/shipment.model";
import {
  TrackingEvent,
  TrackingEventStatus,
  TrackingEventType,
} from "./tracking-event.model";

export async function seedTrackingEvents(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  tracking_events: count=0, se omite");
    return 0;
  }

  const existing = await TrackingEvent.count();
  if (existing > 0) {
    console.log(`⏭️  tracking_events: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const shipmentList = await Shipment.findAll({ where: { is_active: true } });
  const messengerList = await Messenger.findAll({ where: { is_active: true } });
  if (shipmentList.length === 0) {
    console.log("⏭️  tracking_events: faltan dependencias activas (shipmentList), se omite seeder");
    return 0;
  }

  const eventTypes: TrackingEventType[] = [
    "recogido",
    "en_transito",
    "en_reparto",
    "novedad",
    "entregado",
    "devuelto",
  ];
  const statuses: TrackingEventStatus[] = ["informativo", "novedad_leve", "novedad_critica"];
  const rows = Array.from({ length: count }, () => ({
    envio_id: faker.helpers.arrayElement(shipmentList).id!,
    tipo: faker.helpers.arrayElement(eventTypes),
    fecha: faker.date.recent(),
    ubicacion: `${faker.location.city()}, ${faker.location.streetAddress()}`,
    observaciones: faker.lorem.sentence(),
    estado: faker.helpers.arrayElement(statuses),
    registrado_por_id: messengerList.length ? faker.helpers.arrayElement(messengerList).id! : null,
    is_active: true,
  }));

  await TrackingEvent.bulkCreate(rows);
  console.log(`✅ tracking_events: insertados ${count} registro(s) falsos`);
  return count;
}
