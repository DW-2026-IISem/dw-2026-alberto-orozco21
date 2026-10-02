import { faker } from "@faker-js/faker";
import { Company } from "../companies/companies.model";
import { Invoice, InvoiceStatus } from "./invoice.model";

export async function seedInvoices(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  invoices: count=0, se omite");
    return 0;
  }

  const existing = await Invoice.count();
  if (existing > 0) {
    console.log(`⏭️  invoices: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const companyList = await Company.findAll({ where: { is_active: true } });
  if (companyList.length === 0) {
    console.log("⏭️  invoices: faltan dependencias activas (companyList), se omite seeder");
    return 0;
  }

  const statuses: InvoiceStatus[] = ["pendiente", "pagada", "vencida", "anulada"];
  const rows = Array.from({ length: count }, () => {
    const periodoDesde = faker.date.past();
    const periodoHasta = faker.date.between({ from: periodoDesde, to: new Date() });
    const subtotal = Number(faker.commerce.price({ min: 50000, max: 5000000, dec: 2 }));
    const impuestos = Number((subtotal * 0.19).toFixed(2));
    const estado = faker.helpers.arrayElement(statuses);

    return {
      numero: `FE-${faker.string.numeric(6)}`,
      empresa_id: faker.helpers.arrayElement(companyList).id!,
      periodo_desde: periodoDesde.toISOString().slice(0, 10),
      periodo_hasta: periodoHasta.toISOString().slice(0, 10),
      fecha: periodoHasta.toISOString().slice(0, 10),
      subtotal,
      impuestos,
      total: Number((subtotal + impuestos).toFixed(2)),
      estado,
      fecha_pago: estado === "pagada" ? faker.date.between({ from: periodoHasta, to: new Date() }) : null,
      is_active: true,
    };
  });

  await Invoice.bulkCreate(rows);
  console.log(`✅ invoices: insertados ${count} registro(s) falsos`);
  return count;
}
