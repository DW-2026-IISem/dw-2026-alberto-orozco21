import { Sequelize } from 'sequelize-typescript';
import { DatabaseDialect } from '../../../config/environment/env.interface.js';
import { getSequelizeOptions } from './sequelize.options.js';


export const ALL_MODELS = [
  // (aún sin modelos — se agregan por feature)
];

export async function createSequelizeInstance(
  dialect: DatabaseDialect,
): Promise<Sequelize> {
  const options = getSequelizeOptions(dialect);

  async function loadDialectModule(moduleName: string): Promise<any> {
  const mod: any = await import(moduleName);
  return mod.default ?? mod;
}

// ...dentro de createSequelizeInstance:

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
