import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/companies/companies.model";
import { seedCompanies } from "../../features/business/companies/companies.seeder";
import { seedContacts } from "../../features/business/contact/contact.seeder";
import { seedAddresses } from "../../features/business/address/address.seeder";
import { seedMessengers } from "../../features/business/messenger/messenger.seeder";
import { seedRates } from "../../features/business/rate/rate.seeder";
import { seedRoutes } from "../../features/business/route/route.seeder";
import { seedShipments } from "../../features/business/shipment/shipment.seeder";
import { seedPackages } from "../../features/business/package/package.seeder";
import { seedTrackingEvents } from "../../features/business/tracking-event/tracking-event.seeder";
import { seedDeliveryProofs } from "../../features/business/delivery-proof/delivery-proof.seeder";
import { seedInvoices } from "../../features/business/invoice/invoice.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta TODOS los seeders de features, en orden de dependencias
 * (padres antes que hijos): empresa -> contacto -> direccion -> mensajero -> tarifa
 * -> ruta -> envio -> paquete -> evento_tracking -> prueba_entrega -> factura.
 *
 * Uso:
 *   npm run db:seed
 *   npm run db:seed -- --empresas=20
 *   SEED_EMPRESAS=5 npm run db:seed
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  try {
    await sequelize.sync({ force: false, alter: process.env.DB_SYNC_ALTER === "true" });
  } catch (error: any) {
    const errNo = error?.original?.errno ?? error?.errno ?? error?.parent?.errno;
    if (errNo === 1069 || error?.code === "ER_TOO_MANY_KEYS") {
      console.warn(
        "⚠️ Se omite el ALTER automático al sembrar datos por exceso de índices en MySQL; se continúa con los seeders."
      );
    } else {
      throw error;
    }
  }

  // Orden: business (padres → hijos)
  await seedCompanies(counts.companies);
  await seedContacts(counts.contacts);
  await seedAddresses(counts.addresses);
  await seedMessengers(counts.messengers);
  await seedRates(counts.rates);
  await seedRoutes(counts.routes);
  await seedShipments(counts.shipments);
  await seedPackages(counts.packages);
  await seedTrackingEvents(counts.tracking_events);
  await seedDeliveryProofs(counts.delivery_proofs);
  await seedInvoices(counts.invoices);

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
