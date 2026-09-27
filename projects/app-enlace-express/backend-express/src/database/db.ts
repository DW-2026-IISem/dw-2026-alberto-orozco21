import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  dialect: string;
  host: string;
  username: string;
  password: string;
  database: string;
  port: number;
}

const dbConfigurations: Record<string, DatabaseConfig> = {
  mysql: {
    dialect: "mysql",
    host: process.env.DB_MYSQL_HOST || process.env.MYSQL_HOST || "localhost",
    username: process.env.DB_MYSQL_USERNAME || process.env.MYSQL_USER || "root",
    password: process.env.DB_MYSQL_PASSWORD || process.env.MYSQL_PASSWORD || "",
    database: process.env.DB_MYSQL_NAME || process.env.MYSQL_NAME || "test",
    port: parseInt(process.env.DB_MYSQL_PORT || process.env.MYSQL_PORT || "3306")
  },
  postgres: {
    dialect: "postgres",
    host: process.env.DB_POSTGRES_HOST || process.env.POSTGRES_HOST || "localhost",
    username: process.env.DB_POSTGRES_USERNAME || process.env.POSTGRES_USER || "postgres",
    password: process.env.DB_POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD || "",
    database: process.env.DB_POSTGRES_NAME || process.env.POSTGRES_NAME || "test",
    port: parseInt(process.env.DB_POSTGRES_PORT || process.env.POSTGRES_PORT || "5433")
  }
};

const selectedEngine = process.env.DB_ENGINE || "mysql";
const selectedConfig = dbConfigurations[selectedEngine];

if (!selectedConfig) {
  throw new Error(`Motor de base de datos no soportado: ${selectedEngine}`);
}

console.log(`🔌 Conectando a base de datos: ${selectedEngine.toUpperCase()}`);

export const sequelize = new Sequelize(
  selectedConfig.database,
  selectedConfig.username,
  selectedConfig.password,
  {
    host: selectedConfig.host,
    port: selectedConfig.port,
    dialect: selectedConfig.dialect as any,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const getDatabaseInfo = () => {
  return {
    engine: selectedEngine,
    config: selectedConfig,
    connectionString: `${selectedConfig.dialect}://${selectedConfig.username}@${selectedConfig.host}:${selectedConfig.port}/${selectedConfig.database}`
  };
};

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${selectedEngine.toUpperCase()}`);
    return true;
  } catch (error) {
    console.error(`❌ Error de conexión a ${selectedEngine.toUpperCase()}:`, error);
    return false;
  }
};
