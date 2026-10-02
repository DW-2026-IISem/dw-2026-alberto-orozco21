import { faker } from "@faker-js/faker";
import { Shipment } from "../shipment/shipment.model";
import { Package } from "./package.model";

export async function seedPackages(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  packages: count=0, se omite");
    return 0;
  }

  const existing = await Package.count();
  if (existing > 0) {
    console.log(`⏭️  packages: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const shipmentList = await Shipment.findAll({ where: { is_active: true } });
  if (shipmentList.length === 0) {
    console.log("⏭️  packages: faltan dependencias activas (shipmentList), se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    envio_id: faker.helpers.arrayElement(shipmentList).id!,
    descripcion_contenido: faker.commerce.productDescription(),
    peso_kg: Number(faker.commerce.price({ min: 0.2, max: 20, dec: 2 })),
    alto_cm: Number(faker.commerce.price({ min: 5, max: 80, dec: 1 })),
    ancho_cm: Number(faker.commerce.price({ min: 5, max: 80, dec: 1 })),
    largo_cm: Number(faker.commerce.price({ min: 5, max: 80, dec: 1 })),
    valor_declarado: Number(faker.commerce.price({ min: 5000, max: 500000, dec: 2 })),
    es_fragil: faker.datatype.boolean(),
    is_active: true,
  }));

  await Package.bulkCreate(rows);
  console.log(`✅ packages: insertados ${count} registro(s) falsos`);
  return count;
}
