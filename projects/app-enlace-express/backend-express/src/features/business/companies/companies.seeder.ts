import { faker } from "@faker-js/faker";
import { Company } from "./companies.model";


/**
 * Seeder del feature Companies (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedCompanies(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  Companies: count=0, se omite");
    return 0;
  }

  const existing = await Company.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  Companies: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }




  const rows = Array.from({ length: count }, () => ({
      nit: faker.string.numeric(10),
      razon_social: faker.company.name(),
      is_active: true,
  }));

  await Company.bulkCreate(rows);
  console.log(`\u2705 Companies: insertados ${count} registro(s) falsos`);
  return count;
}
