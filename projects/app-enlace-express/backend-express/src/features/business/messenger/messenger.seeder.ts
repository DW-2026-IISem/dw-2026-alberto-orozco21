import { faker } from "@faker-js/faker";
import { Messenger, VehicleType } from "./messenger.model";

export async function seedMessengers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  messengers: count=0, se omite");
    return 0;
  }

  const existing = await Messenger.count();
  if (existing > 0) {
    console.log(`⏭️  messengers: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const vehicleTypes: VehicleType[] = ["moto", "carro", "bicicleta", "a_pie"];
  const rows = Array.from({ length: count }, () => ({
    nombre: faker.person.fullName(),
    documento_identidad: faker.string.numeric(10),
    telefono: faker.phone.number({ style: "national" }),
    tipo_vehiculo: faker.helpers.arrayElement(vehicleTypes),
    placa_vehiculo: faker.vehicle.vrm(),
    zona_asignada: faker.location.city(),
    is_active: true,
  }));

  await Messenger.bulkCreate(rows);
  console.log(`✅ messengers: insertados ${count} registro(s) falsos`);
  return count;
}
