import { faker } from "@faker-js/faker";
import { Shipment } from "../shipment/shipment.model";
import { DeliveryProof, DeliveryProofStatus } from "./delivery-proof.model";

export async function seedDeliveryProofs(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  delivery_proofs: count=0, se omite");
    return 0;
  }

  const existing = await DeliveryProof.count();
  if (existing > 0) {
    console.log(`⏭️  delivery_proofs: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const shipmentList = await Shipment.findAll({ where: { is_active: true } });
  if (shipmentList.length === 0) {
    console.log("⏭️  delivery_proofs: faltan dependencias activas (shipmentList), se omite seeder");
    return 0;
  }

  const availableShipments = faker.helpers.shuffle(shipmentList).slice(0, count);
  const statuses: DeliveryProofStatus[] = ["valida", "observada", "rechazada"];
  const rows = availableShipments.map((shipment) => ({
    envio_id: shipment.id,
    fecha_hora: faker.date.recent(),
    receptor_nombre: faker.person.fullName(),
    receptor_documento: faker.string.numeric(10),
    firma_url: faker.image.url(),
    foto_url: faker.image.url(),
    geolocalizacion_lat: Number(faker.location.latitude()),
    geolocalizacion_lng: Number(faker.location.longitude()),
    observaciones: faker.lorem.sentence(),
    estado: faker.helpers.arrayElement(statuses),
    is_active: true,
  }));

  await DeliveryProof.bulkCreate(rows);
  console.log(`✅ delivery_proofs: insertados ${rows.length} registro(s) falsos`);
  return rows.length;
}
