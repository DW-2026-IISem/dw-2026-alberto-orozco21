import { registerAs } from '@nestjs/config';

const allowedDialects = ['mysql', 'postgres', 'mssql', 'oracle'] as const;
export type AllowedDialect = (typeof allowedDialects)[number];

export default registerAs('database', () => {
  const dialect = process.env.DB_DIALECT;
  if (!dialect || !allowedDialects.includes(dialect as AllowedDialect)) {
    throw new Error('DB_DIALECT debe ser mysql, postgres, mssql u oracle');
  }
  return {
    dialect: dialect as AllowedDialect,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
});