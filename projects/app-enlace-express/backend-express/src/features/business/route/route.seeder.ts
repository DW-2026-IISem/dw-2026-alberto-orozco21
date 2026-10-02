import { faker } from "@faker-js/faker";
import { Messenger } from "../messenger/messenger.model";
import { RouteStatus, Route } from "./route.model";

export async function seedRoutes(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  routes: count=0, se omite");
    return 0;
  }

  const existing = await Route.count();
  if (existing > 0) {
    console.log(`⏭️  routes: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const messengerList = await Messenger.findAll({ where: { is_active: true } });
  if (messengerList.length === 0) {
    console.log("⏭️  routes: faltan dependencias activas (messengerList), se omite seeder");
    return 0;
  }

  const statuses: RouteStatus[] = ["planificada", "en_curso", "finalizada"];
  const rows = Array.from({ length: count }, () => {
    const start = faker.date.soon();
    const end = new Date(start.getTime() + faker.number.int({ min: 1, max: 8 }) * 60 * 60 * 1000);

    return {
      nombre: `Ruta ${faker.location.city()}`,
      mensajero_id: faker.helpers.arrayElement(messengerList).id,
      zona_cobertura: faker.location.city(),
      fecha: start.toISOString().slice(0, 10),
      hora_inicio: start,
      hora_fin: end,
      estado: faker.helpers.arrayElement(statuses),
      is_active: true,
    };
  });

  await Route.bulkCreate(rows);
  console.log(`✅ routes: insertados ${count} registro(s) falsos`);
  return count;
}
