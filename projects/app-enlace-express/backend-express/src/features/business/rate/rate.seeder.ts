import { faker } from "@faker-js/faker";
import { CalculationRule, Rate } from "./rate.model";

export async function seedRates(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  rates: count=0, se omite");
    return 0;
  }

  const existing = await Rate.count();
  if (existing > 0) {
    console.log(`⏭️  rates: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const calculationRules: CalculationRule[] = ["por_peso", "por_zona", "plana"];
  const rows = Array.from({ length: count }, () => {
    const vigenciaDesde = faker.date.past();
    const vigenciaHasta = faker.date.future({ refDate: vigenciaDesde });

    return {
      nombre: `${faker.commerce.productAdjective()} ${faker.word.noun()}`,
      zona: faker.location.city(),
      regla_calculo: faker.helpers.arrayElement(calculationRules),
      valor_base: Number(faker.commerce.price({ min: 5000, max: 20000, dec: 2 })),
      valor_por_kg_adicional: Number(faker.commerce.price({ min: 500, max: 3000, dec: 2 })),
      recargo_urgente_pct: Number(faker.commerce.price({ min: 5, max: 40, dec: 2 })),
      vigencia_desde: vigenciaDesde.toISOString().slice(0, 10),
      vigencia_hasta: vigenciaHasta.toISOString().slice(0, 10),
      is_active: true,
    };
  });

  await Rate.bulkCreate(rows);
  console.log(`✅ rates: insertados ${count} registro(s) falsos`);
  return count;
}
