import { faker } from "@faker-js/faker";
import { Address } from "../address/address.model";
import { Company } from "../companies/companies.model";
import { Contact } from "../contact/contact.model";
import { Messenger } from "../messenger/messenger.model";
import { Rate } from "../rate/rate.model";
import { Route } from "../route/route.model";
import { ShipmentPriority, ShipmentStatus, Shipment } from "./shipment.model";

export async function seedShipments(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  shipments: count=0, se omite");
    return 0;
  }

  const existing = await Shipment.count();
  if (existing > 0) {
    console.log(`⏭️  shipments: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const companyList = await Company.findAll({ where: { is_active: true } });
  const contactList = await Contact.findAll({ where: { is_active: true } });
  const addressList = await Address.findAll({ where: { is_active: true } });
  const messengerList = await Messenger.findAll({ where: { is_active: true } });
  const routeList = await Route.findAll({ where: { is_active: true } });
  const rateList = await Rate.findAll({ where: { is_active: true } });

  const requiredDependencies: Array<[string, unknown[]]> = [
    ["companyList", companyList],
    ["contactList", contactList],
    ["addressList", addressList],
    ["rateList", rateList],
  ];
  const missingDependency = requiredDependencies.find(([, records]) => records.length === 0);
  if (missingDependency) {
    console.log(`⏭️  shipments: faltan dependencias activas (${missingDependency[0]}), se omite seeder`);
    return 0;
  }

  const priorities: ShipmentPriority[] = ["normal", "urgente", "express"];
  const statuses: ShipmentStatus[] = [
    "creado",
    "cotizado",
    "asignado",
    "en_ruta",
    "entregado",
    "con_novedad",
    "cancelado",
  ];
  const rows = Array.from({ length: count }, () => ({
    numero_guia: `EE-${faker.string.alphanumeric(8).toUpperCase()}`,
    empresa_id: faker.helpers.arrayElement(companyList).id!,
    contacto_origen_id: faker.helpers.arrayElement(contactList).id!,
    direccion_origen_id: faker.helpers.arrayElement(addressList).id!,
    contacto_destino_id: faker.helpers.arrayElement(contactList).id!,
    direccion_destino_id: faker.helpers.arrayElement(addressList).id!,
    mensajero_id: messengerList.length ? faker.helpers.arrayElement(messengerList).id! : null,
    ruta_id: routeList.length ? faker.helpers.arrayElement(routeList).id! : null,
    tarifa_id: faker.helpers.arrayElement(rateList).id!,
    prioridad: faker.helpers.arrayElement(priorities),
    peso_total_kg: Number(faker.commerce.price({ min: 0.5, max: 50, dec: 2 })),
    valor_declarado: Number(faker.commerce.price({ min: 10000, max: 2000000, dec: 2 })),
    costo_calculado: Number(faker.commerce.price({ min: 5000, max: 100000, dec: 2 })),
    estado: faker.helpers.arrayElement(statuses),
    fecha_solicitud: faker.date.recent(),
    fecha_entrega_estimada: faker.date.soon(),
    fecha_entrega_real: faker.date.recent(),
    is_active: true,
  }));

  await Shipment.bulkCreate(rows);
  console.log(`✅ shipments: insertados ${count} registro(s) falsos`);
  return count;
}
