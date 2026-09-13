import { Sequelize } from 'sequelize-typescript';
import { DatabaseDialect } from '../../../config/environment/env.interface.js';
import { getSequelizeOptions } from './sequelize.options.js';

import { CompanyModel } from '../../../features/shipping/companies/infrastructure/persistence/models/company.model.js';
import { ContactModel } from '../../../features/shipping/contacts/infrastructure/persistence/models/contact.model.js';
import { AddressModel } from '../../../features/shipping/addresses/infrastructure/persistence/models/address.model.js';
import { RateModel } from '../../../features/shipping/rates/infrastructure/persistence/models/rate.model.js';
import { CourierModel } from '../../../features/shipping/couriers/infrastructure/persistence/models/courier.model.js';
import { RouteModel } from '../../../features/shipping/routes/infrastructure/persistence/models/route.model.js';

export const ALL_MODELS = [
  CompanyModel,
  ContactModel,
  AddressModel,
  RateModel,
  CourierModel,
  RouteModel,
];

async function loadDialectModule(moduleName: string): Promise<any> {
  // Proyecto ESM: require() no existe como global, se usa import() dinámico.
  const mod: any = await import(moduleName);
  return mod.default ?? mod;
}

export async function createSequelizeInstance(
  dialect: DatabaseDialect,
): Promise<Sequelize> {
  const options = getSequelizeOptions(dialect);

  let dialectModule: any;

  switch (dialect) {
    case DatabaseDialect.MySQL:
      dialectModule = await loadDialectModule('mysql2');
      break;
    case DatabaseDialect.Postgres:
      dialectModule = await loadDialectModule('pg');
      break;
    case DatabaseDialect.MSSQL:
      dialectModule = await loadDialectModule('tedious');
      break;
    case DatabaseDialect.Oracle:
      dialectModule = await loadDialectModule('oracledb');
      break;
    default:
      throw new Error(`Dialecto no soportado: ${dialect}`);
  }

  const sequelize = new Sequelize({
    ...options,
    dialectModule,
    models: ALL_MODELS,
  } as any);

  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${dialect.toUpperCase()}`);
  } catch (error: any) {
    console.error(
      `❌ Error conectando a ${dialect.toUpperCase()}:`,
      error.message,
    );
    throw error;
  }

  if (process.env.NODE_ENV !== 'production') {
    await sequelize.sync({ alter: false });
    console.log('✅ Tablas sincronizadas');
  }

  return sequelize;
}
