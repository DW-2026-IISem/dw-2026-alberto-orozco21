# Bitacora de creación del backend utilizando Express

## 1. ISS-00 — Requisitos previos

**Objetivo:** entorno listo para el laboratorio.  
**Bloqueado por:** ninguno.

### Criterios de aceptación (ISS-00)

- [X] `node -v` muestra v20+ (lab: v24.x)

- [X] `npm -v` responde

- [X] Motor de BD accesible (MySQL recomendado para el primer `sync`)

### Pasos

```bash
node -v
npm -v
```

### Verificación del ISS

```bash
node -v && npm -v
```

![alt text](img-express/node_npm.png)

---

## 2. ISS-01 — Esqueleto del proyecto

**Objetivo:** proyecto npm + TypeScript + Express con estructura `features/` y servidor HTTP base.
**Bloqueado por:** ISS-00.

### Criterios de aceptación (ISS-01)

- [X] **2.1** Existe `package.json` con `"type": "commonjs"` y scripts `build` / `dev`
- [X] **2.2** Árbol `src/` con `config`, `database/seeders`, `routes`, `features/business/companies`
- [X] **2.3** Dependencias Express/TS instaladas
- [X] **2.4** Existe `tsconfig.json` (`rootDir: ./src`, `outDir: ./dist`, `strict: true`)
- [X] **2.5** Existen `src/server.ts` y `src/config/index.ts` (esqueleto App)
- [X] `npx tsc --noEmit` sin errores al cerrar el ISS

---

## 2.1 Inicializar npm y scripts

```bash
mkdir backend-express
cd backend-express
npm init -y
mkdir -p docs
```

![alt text](img-express/init.png)

**PARCHE** — `package.json` **ya existe** (lo creó `npm init -y`).

- **Dentro de** `"scripts"`: deja solo (o añade) `build` y `dev` como abajo.
- **Debajo de** `"license"`: asegúrate de `"type": "commonjs"`.

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "nodemon --watch src --ext ts --exec ts-node -- src/server.ts"
  },
  "type": "commonjs"
}
```

![alt text](img-express/package_json.png)

```bash
node -e "const p=require('./package.json'); console.log(p.scripts)"
```

![alt text](img-express/p.scripts.png)

---

## 2.2 Estructura de carpetas (features)

```bash
mkdir -p \
  src/config \
  src/database/seeders \
  src/routes \
  src/features/business/companies
```

![alt text](img-express/features.png)

```text
src/
├── config/
├── database/
│   └── seeders/          # solo carpeta (ISS-02 §3.3); runner en ISS-04
├── routes/
├── features/
│   └── business/
│       └── companies/      # más features en ISS-06…16
└── server.ts             # §2.5
```

| Carpeta | Uso |
|---------|-----|
| `features/business/<entidad>/` | model + controller + routes (+ seeder, swagger, http, associations) |
| `database/seeders/` | counts + SeedersRunner (`npm run db:seed`) |
| `routes/index.ts` | Agregador de features |
| `config/` · `database/` | Arranque e infraestructura |

---

## 2.3 Dependencias base (Express + TypeScript)

```bash
npm install express@^5.2.1 cors@^2.8.6 dotenv@^17.4.2 morgan@^1.12.1

npm install -D typescript@~5.9.2 ts-node@^10.9.2 nodemon@^3.1.14 \
  @types/node@^22.20.3 @types/express@^5.0.6 \
  @types/cors@^2.8.19 @types/morgan@^1.9.10
```

```bash
npm ls --depth=0
```

![alt text](img-express/depth1.png)

---

## 2.4 TypeScript (`tsconfig.json`)

```bash
: > tsconfig.json
cat >> tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "commonjs",
    "target": "ES2020",
    "lib": ["ES2020"],
    "types": ["node"],
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

![alt text](img-express/tsconfig.json.png)

---

## 2.5 Servidor y App (esqueleto HTTP)

### 2.5.1 `src/server.ts`

```bash
: > src/server.ts
cat >> src/server.ts << 'EOF'
import { App } from './config/index';

async function main() {
    const app = new App();
    await app.listen();
}

main();
EOF
```

![alt text](img-express/src-server.png)

### 2.5.2 `src/config/index.ts` (esqueleto)

```bash
: > src/config/index.ts
cat >> src/config/index.ts << 'EOF'
import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
var cors = require("cors");

dotenv.config();

export class App {
  public app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    // ISS-03 §4.3
  }

  private async dbConnection(): Promise<void> {
    // ISS-02 / ISS-03
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
EOF
```

![alt text](img-express/src-config-index.png)

### Verificación del ISS-01

```bash
npx tsc --noEmit
find src -type f | sort
```

![alt text](img-express/iss-01-verificar.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/cierre_iss-01.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

## 3. ISS-02 — Infraestructura de base de datos

**Objetivo:** drivers + `.env` + módulo Sequelize + carpeta `seeders/`.
**Bloqueado por:** ISS-01.

### Criterios de aceptación (ISS-02)

- [X] **3.1** Paquetes Sequelize/drivers instalados; existe `.env` con `DB_ENGINE` y bloques de motores
- [X] **3.2** Existe `src/database/db.ts` exportando `sequelize`, `getDatabaseInfo`, `testConnection`
- [X] **3.3** Existe carpeta `src/database/seeders/` **sin** lógica implementada aún
- [X] `npx tsc --noEmit` OK

---

## 3.1 Drivers Sequelize y `.env`

```bash
npm install sequelize@^6.37.8 mysql2@^3.24.4 pg@^8.23.0 pg-hstore@^2.3.4 \
  tedious@^20.0.0 oracledb@^7.0.1
npm install -D @types/sequelize@^6.12.0
```

```bash
: > .env
cat >> .env << 'EOF'
PORT=4000

# Variable para seleccionar el motor de base de datos
DB_ENGINE=mysql

# --- MYSQL ---
DB_MYSQL_HOST=localhost
DB_MYSQL_PORT=3306
DB_MYSQL_USERNAME=root
DB_MYSQL_PASSWORD=AlbertoMySQL3306
DB_MYSQL_NAME=express

# --- POSTGRES ---
DB_POSTGRES_HOST=localhost
DB_POSTGRES_PORT=5433
DB_POSTGRES_USERNAME=alberto
DB_POSTGRES_PASSWORD=PostgreSQL5433
DB_POSTGRES_NAME=express

# --- MSSQL (SQL Server) ---
DB_MSSQL_HOST=localhost
DB_MSSQL_PORT=1433
DB_MSSQL_USERNAME=sa
DB_MSSQL_PASSWORD=sqlServer1433
DB_MSSQL_NAME=express

# --- ORACLE ---
DB_ORACLE_HOST=localhost
DB_ORACLE_PORT=1521
DB_ORACLE_USERNAME=system
DB_ORACLE_PASSWORD=OracleXe1521
DB_ORACLE_NAME=express
DB_ORACLE_CONNECT_STRING=localhost:1521/XEPDB1
EOF
```

```bash
test -f .env && grep DB_ENGINE .env
npm ls sequelize mysql2 --depth=0
```

![alt text](img-express/sequelize_env.png)

---

## 3.2 Configuración Sequelize (`database/db.ts`)

```bash
: > src/database/db.ts
cat >> src/database/db.ts << 'EOF'
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
    host: process.env.MYSQL_HOST || "localhost",
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_NAME || "test",
    port: parseInt(process.env.MYSQL_PORT || "3306")
  },
  postgres: {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "",
    database: process.env.POSTGRES_NAME || "test",
    port: parseInt(process.env.POSTGRES_PORT || "5432")
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
EOF
```

![alt text](img-express/db.png)

---

## 3.3 Carpeta seeders (reservada)

```bash
touch src/database/seeders/.gitkeep
```

> La lógica de seeders (runner + counts) llega en ISS-04.

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_iss-02.png)

> El servidor debe arrancar sin error (sin BD conectada aún es esperado si no hay motor disponible). Detenerlo con Ctrl+C.

## 4. ISS-03 — Feature Company

**Objetivo:** primera feature de negocio: modelo, controller/routes CRUD completo, carpeta `http/` y cableado en `routes/index.ts` + `config/index.ts`. Es la entidad base del dominio (no tiene FKs propias todavía — `contacto_principal_id` y `direccion_facturacion_id` se agregan más adelante por PARCHE en ISS-08, cuando existan `Contacto` y `Direccion`).  
**Bloqueado por:** ISS-02.

### Criterios de aceptación (ISS-03)

- [X] **4.1** Modelo `companies.model.ts` (`is_active` boolean + `timestamps: true`)
- [X] **4.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [X] **4.3** Carpeta `http/` con get, create, update, delete
- [X] **4.4** Cableado en `routes/index.ts` + `config/index.ts` (import modelo + `sync`)
- [X] Con BD: `npm run dev` → conexión OK + sync OK + tabla `companies`

---

```bash
mkdir -p \
  src/features/business/companies/http
```

## 4.1 Modelo companies

```bash
: > src/features/business/companies/companies.model.ts
cat >> src/features/business/companies/companies.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface CompanyI {
  id?: number;
  nit: string;
  razon_social: string;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Company extends Model {
  public id!: number;
  public nit!: string;
  public razon_social!: string;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init(
  {
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    razon_social: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Companies",
    tableName: "companies",
    timestamps: true,
  }
);
EOF
```

---

## 4.2 Controller + routes (CRUD completo)

### 4.2.1 Controller

```bash
: > src/features/business/companies/companies.controller.ts
cat >> src/features/business/companies/companies.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Company, CompanyI } from "./companies.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class CompaniesController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const companies = await Company.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ companies });
    } catch (error) {
      res.status(500).json({ error: "Error fetching Companies", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const companies = await Company.findByPk(id);
      if (!companies) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      res.status(200).json({ companies });
    } catch (error) {
      res.status(500).json({ error: "Error fetching Company", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as CompanyI;


      const companies = await Company.create({
        nit: body.nit,
        razon_social: body.razon_social,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ companies });
    } catch (error) {
      res.status(500).json({ error: "Error creating Company", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as CompanyI;
      const companies = await Company.findByPk(id);
      if (!companies) {
        res.status(404).json({ error: "Company not found" });
        return;
      }


      await companies.update({
        nit: body.nit,
        razon_social: body.razon_social,
        is_active: body.is_active ?? companies.is_active,
      });

      res.status(200).json({ companies });
    } catch (error) {
      res.status(500).json({ error: "Error updating Company (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<CompanyI>;
      const companies = await Company.findByPk(id);
      if (!companies) {
        res.status(404).json({ error: "Company not found" });
        return;
      }

      await companies.update(body);
      res.status(200).json({ companies });
    } catch (error) {
      res.status(500).json({ error: "Error updating Company (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const companies = await Company.findByPk(id);
      if (!companies) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      await companies.destroy();
      res.status(200).json({ message: "Company permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting Company", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const companies = await Company.findByPk(id);
      if (!companies) {
        res.status(404).json({ error: "Company not found" });
        return;
      }
      await companies.update({ is_active: false });
      res.status(200).json({
        message: "Company deactivated (logical delete)",
        companies,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating Company", detail: String(error) });
    }
  }
}
EOF
```

### 4.2.1 Routes

```bash
: > src/features/business/companies/companies.routes.ts
cat >> src/features/business/companies/companies.routes.ts << 'EOF'
import { Application } from "express";
import { CompaniesController } from "./companies.controller";

export class CompaniesRoutes {
  public companiesController: CompaniesController = new CompaniesController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/companies")
      .get(this.companiesController.getAll.bind(this.companiesController));

    // getOne
    app
      .route("/api/companies/:id")
      .get(this.companiesController.getOne.bind(this.companiesController));

    // create
    app
      .route("/api/companies")
      .post(this.companiesController.create.bind(this.companiesController));

    // update (PUT / PATCH)
    app
      .route("/api/companies/:id")
      .put(this.companiesController.updatePut.bind(this.companiesController))
      .patch(this.companiesController.updatePatch.bind(this.companiesController));

    // delete fisico
    app
      .route("/api/companies/:id")
      .delete(this.companiesController.deletePhysical.bind(this.companiesController));

    // delete logico
    app
      .route("/api/companies/:id/deactivate")
      .patch(this.companiesController.deleteLogical.bind(this.companiesController));
  }
}
EOF
```

## 4.3 HTTP

**GET**

```bash
: > src/features/business/companies/http/companies.get.http
cat >> src/features/business/companies/http/companies.get.http << 'EOF'
### Feature Companies — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllCompanies
GET {{baseUrl}}/api/companies

###

# @name getOneEmpresa
GET {{baseUrl}}/api/companies/{{id}}
EOF
```

**CREATE**

```bash
: > src/features/business/companies/http/companies.create.http
cat >> src/features/business/companies/http/companies.create.http << 'EOF'
### Feature Companies — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createCompany
POST {{baseUrl}}/api/companies
Content-Type: application/json

{
  "nit": "Ejemplo nit",
  "razon_social": "Ejemplo razon_social",
  "is_active": true
}
EOF
```

**UPDATE**

```bash
: > src/features/business/companies/http/companies.update.http
cat >> src/features/business/companies/http/companies.update.http << 'EOF'
### Feature Company — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updateCompanyPut
PUT {{baseUrl}}/api/companies/{{id}}
Content-Type: application/json

{
  "nit": "Ejemplo nit",
  "razon_social": "Ejemplo razon_social",
  "is_active": true
}

###

# @name updateCompanyPatch
PATCH {{baseUrl}}/api/companies/{{id}}
Content-Type: application/json

{
  "razon_social": "Ejemplo razon_social"
}
EOF
```

**DELETE**

```bash
: > src/features/business/companies/http/companiess.delete.http
cat >> src/features/business/companies/http/companiess.delete.http << 'EOF'
### Feature Company — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteCompanyPhysical
DELETE {{baseUrl}}/api/companies/{{id}}

###

# @name deleteCompanyLogical
PATCH {{baseUrl}}/api/companies/{{id}}/deactivate
EOF
```

---

## 4.4 Agregador Routes + cableado en Config

```bash
: > src/routes/index.ts
cat >> src/routes/index.ts << 'EOF'
import { CompaniesRoutes } from "../features/business/companies/companies.routes";

export class Routes {
  public companiesRoutes: CompaniesRoutes = new CompaniesRoutes();
}
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe** (ISS-01, esqueleto).

1. **Debajo de** `var cors = require("cors");` **añadir**:

```ts
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
import "../features/business/companies/companies.model";
import { Routes } from "../routes/index";
```

2. **Dentro de** `export class App`, **debajo de** `public app: Application;` **añadir**:

```ts
  public routePrv: Routes = new Routes();
```

3. **Dentro de** `routes()`, **reemplazar** el comentario `// ISS-03 §4.3` por:

```ts
    this.routePrv.companiesRoutes.routes(this.app);
```

4. **Dentro de** `dbConnection()`, **reemplazar** el comentario `// ISS-02 / ISS-03` por:

```ts
    try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      // alter: true actualiza columnas faltantes (ej. createdAt/updatedAt tras timestamps: true).
      // force: false no recrea tablas; no borra datos. En producción preferir migraciones.
      await sequelize.sync({ force: false, alter: true });
      console.log(`📦 Base de datos sincronizada exitosamente`);
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
```

### Verificación

```bash
test -d src/features/business/companies/http && echo HTTP_FOLDER_OK
curl -s http://localhost:4000/api/companies
```

![alt text](img-express/v_companies.png)

### Cierre del ISS
```bash
npm run dev
```

![alt text](img-express/run_companies.png)

> Sync OK y tabla `companies` (con `createdAt` / `updatedAt`). Detenerlo con Ctrl+C antes de continuar.

## 5. ISS-04 — Seeders con Faker (feature + runner externo)

**Objetivo:** datos falsos por feature (Faker) y un orquestador externo que ejecuta todos los seeders enviando la cantidad por entidad.  
**Bloqueado por:** ISS-03.

### Criterios de aceptación (ISS-04)

- [ ] **5.1** `features/business/companies/companies.seeder.ts` con `@faker-js/faker`, idempotente
- [ ] **5.2** `database/seeders/index.ts` (SeedersRunner) + `database/seeders/counts.ts`
- [ ] Script `npm run db:seed` funciona; cantidad configurable por CLI/env

---

## 5.1 Seeder dentro del feature Companies

```bash
npm install -D @faker-js/faker@^10.6.0
```

```bash
: > src/features/business/companies/companies.seeder.ts
cat >> src/features/business/companies/companies.seeder.ts << 'EOF'
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
EOF
```

---

## 5.2 SeedersRunner + conteos por entidad

```bash
: > src/database/seeders/counts.ts
cat >> src/database/seeders/counts.ts << 'EOF'
export type SeedCounts = {
  Companies: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  Companies: 15,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envCompanies = process.env.SEED_COMPANIES;
  if (envCompanies !== undefined && envCompanies !== "") {
    counts.Companies = Number(envCompanies);
  }

  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
EOF
```

```bash
: > src/database/seeders/index.ts
cat >> src/database/seeders/index.ts << 'EOF'
import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/companies/companies.model";
import { seedCompanies } from "../../features/business/companies/companies.seeder";
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

  await sequelize.sync({ force: false, alter: true });

  // Orden: business (padres → hijos)
  await seedCompanies(counts.Companies);

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
EOF
```

**PARCHE** — `package.json` **ya existe**.

**Dentro de** `"scripts"`, **debajo de** `"dev": "..."`, **añadir**:

```json
    "db:seed": "ts-node -- src/database/seeders/index.ts"
```

### Verificación
```bash
npm run db:seed
npm run db:seed -- --empresas=20
SEED_EMPRESAS=5 npm run db:seed
```

![alt text](img-express/run_sedder_companies.png)

**Al agregar otra entidad (patrón, repetido en cada ISS siguiente):**

1. Archivo nuevo `features/.../<entidad>.seeder.ts`.
2. **PARCHE** `counts.ts`: añadir clave dentro de `SeedCounts` / `DEFAULT_SEED_COUNTS`.
3. **PARCHE** `database/seeders/index.ts`: añadir import + llamada `await seedX(counts.x);` debajo de la anterior.

### Cierre del ISS
```bash
npm run dev
```

![alt text](img-express/run_companies_sedder.png)

![alt text](img-express/companies_data.png)

## 6. ISS-05 — Swagger / OpenAPI (feature + registry externo)

**Objetivo:** documentar el API del feature Empresa en OpenAPI 3 y montar Swagger UI desde un registry externo (mismo patrón que seeders).  
**Bloqueado por:** ISS-03.

### Criterios de aceptación (ISS-05)

- [ ] **6.1** `features/business/companies/companies.swagger.ts` con tags, paths y schemas (leyenda **SIN AUTH**)
- [ ] **6.2** `src/swagger/index.ts` agrega módulos de features y monta UI
- [ ] `App` llama `setupSwagger` (método `docs()`)
- [ ] `GET /api/docs` muestra Swagger UI y `GET /api/docs.json` el documento OpenAPI

---

## 6.1 OpenAPI dentro del feature Companies

```bash
npm install swagger-ui-express@^5.0.1
npm install -D @types/swagger-ui-express@^4.1.8
```

```bash
: > src/features/business/companies/companies.swagger.ts
cat >> src/features/business/companies/companies.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature Companies.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

import { Company } from "./companies.model";

export const companiesSwagger = {
  tags: [
    {
      name: "Empresas",
      description: "CRUD de empresas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/companies": {
      get: {
        tags: ["Empresas"],
        summary: "Listar empresas activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de empresas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    empresas: {
                      type: "array",
                      items: { $ref: "#/components/schemas/company" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Empresas"],
        summary: "Crear empresa",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/companyCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Empresa creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    empresa: { $ref: "#/components/schemas/company" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/companies/{id}": {
      get: {
        tags: ["Empresas"],
        summary: "Obtener empresa por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Empresa encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    empresa: { $ref: "#/components/schemas/company" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrada" },
        },
      },
      put: {
        tags: ["Empresas"],
        summary: "Actualizar empresa (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/companyCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada" },
        },
      },
      patch: {
        tags: ["Empresas"],
        summary: "Actualizar empresa (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/companyPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada" },
        },
      },
      delete: {
        tags: ["Empresas"],
        summary: "Eliminar empresa (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminada" },
          "404": { description: "No encontrada" },
        },
      },
    },
    "/api/companies/{id}/deactivate": {
      patch: {
        tags: ["Empresas"],
        summary: "Eliminar empresa (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivada" },
          "404": { description: "No encontrada" },
        },
      },
    },
  },
  components: {
    schemas: {
      company: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      nit: { type: "string", example: "nit" },
      razon_social: { type: "string", example: "razon_social" },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      companyCreate: {
        type: "object",
        required: ["nit", "razon_social"],
        properties: {
      nit: { type: "string", example: "nit" },
      razon_social: { type: "string", example: "razon_social" },
      is_active: { type: "boolean", example: true },
        },
      },
      companyPatch: {
        type: "object",
        properties: {
      nit: { type: "string", example: "nit" },
      razon_social: { type: "string", example: "razon_social" },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```

---

## 6.2 Registry externo + montaje en Config

```bash
mkdir -p \
  src/swagger
```

```bash
: > src/swagger/index.ts
cat >> src/swagger/index.ts << 'EOF'
import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { companiesSwagger } from "../features/business/companies/companies.swagger";

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

/**
 * Registry externo: importa la documentación OpenAPI de cada feature
 * (mismo patrón que SeedersRunner).
 */
const featureSwaggerModules: FeatureSwaggerModule[] = [
  companiesSwagger,
  // contactSwagger,
  // direccionSwagger,
];

export function buildOpenApiDocument() {
  const tags: unknown[] = [];
  const paths: Record<string, unknown> = {};
  const schemas: Record<string, unknown> = {};

  for (const mod of featureSwaggerModules) {
    tags.push(...mod.tags);
    Object.assign(paths, mod.paths);
    if (mod.components?.schemas) {
      Object.assign(schemas, mod.components.schemas);
    }
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "EnlaceExpress API",
      version: "1.0.0",
      description:
        "API EnlaceExpress (Express + Sequelize). Todas las rutas business son **SIN AUTH** en este lab.",
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 4000}`, description: "Local" },
    ],
    tags,
    paths,
    components: { schemas },
  };
}

/** Monta Swagger UI y el JSON OpenAPI */
export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("📘 Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import { Routes } from "../routes/index";`, **añadir**:

```ts
import { setupSwagger } from "../swagger/index";
```

2. **Dentro del** `constructor`, **debajo de** `this.routes();` y **encima de** `this.dbConnection();`, **añadir**:

```ts
    this.docs();
```

3. **Dentro de** la clase `App`, **debajo de** `routes()` y **encima de** `dbConnection()`, **añadir**:

```ts
  private docs(): void {
    setupSwagger(this.app);
  }
```

### Verificación
```bash
curl -s http://localhost:4000/api/docs.json | head
```

![alt text](img-express/api_docs_json.png)

> Con el servidor del cierre: abrir `http://localhost:4000/api/docs`.

**Al agregar otra entidad (patrón, repetido en cada ISS siguiente):**

1. Archivo nuevo `features/.../<entidad>.swagger.ts`.
2. **PARCHE** `src/swagger/index.ts`: añadir import + entrada en `featureSwaggerModules`.

### Cierre del ISS
```bash
npm run dev
```

![alt text](img-express/swagger_companies.png)

> Abrir `http://localhost:4000/api/docs`. Detenerlo con Ctrl+C antes de continuar.

---

## 7. ISS-06 — Feature Contact

**Objetivo:** CRUD completo + seeder + swagger de **Contact** (tabla `contacts`).  
**Bloqueado por:** ISS-05.  
**API:** `/api/contacts` — **SIN AUTH**.  
**Patrón:** mismo que las features anteriores (modelo → controller/routes → http → cableado → relación → seeder → swagger).

### Criterios de aceptación (ISS-06)

- [X] **7.1** Modelo `contact.model.ts` (`is_active` boolean + `timestamps: true`, columnas snake_case)
- [X] **7.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [X] **7.3** Carpeta `http/` con get, create, update, delete
- [X] **7.4** Cableado en `routes/index.ts` + `config/index.ts`
- [X] **7.5** Asociaciones (`contact.associations.ts`) + PARCHE `config`
- [X] **7.6** Seeder + registro en SeedersRunner / `counts.ts`
- [X] **7.7** Swagger + registro en `src/swagger`

---

```bash
mkdir -p \
  src/features/business/contact/http
```

## 7.1 Modelo Contact

```bash
: > src/features/business/contact/contact.model.ts
cat >> src/features/business/contact/contact.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ContactI {
  id?: number;
  empresa_id: number;
  nombre: string;
  cargo?: string | null;
  telefono?: string | null;
  email?: string | null;
  is_principal?: boolean;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Contact extends Model {
  public id!: number;
  public empresa_id!: number;
  public nombre!: string;
  public cargo!: string | null;
  public telefono!: string | null;
  public email!: string | null;
  public is_principal!: boolean;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Contact.init(
  {
    empresa_id: {
      type: DataTypes.INTEGER,
      references: { model: "companies", key: "id" },
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_principal: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Contact",
    tableName: "contacts",
    timestamps: true,
  }
);
EOF
```

---

## 7.2 Controller + routes (CRUD completo)

**Controller**

```bash
: > src/features/business/contact/contact.controller.ts
cat >> src/features/business/contact/contact.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Contact, ContactI } from "./contact.model";
import { Company } from "../company/company.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class ContactController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const contacts = await Contact.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ contacts });
    } catch (error) {
      res.status(500).json({ error: "Error fetching contacts", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }
      res.status(200).json({ contact: contact });
    } catch (error) {
      res.status(500).json({ error: "Error fetching contact", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ContactI;
      if (body.empresa_id !== undefined && body.empresa_id !== null) {
        const found_empresa_id = await Company.findByPk(body.empresa_id);
        if (!found_empresa_id) {
          res.status(404).json({ error: "Company (empresa_id) not found" });
          return;
        }
      }

      const contact = await Contact.create({
        empresa_id: body.empresa_id,
        nombre: body.nombre,
        cargo: body.cargo ?? null,
        telefono: body.telefono ?? null,
        email: body.email ?? null,
        is_principal: body.is_principal ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ contact: contact });
    } catch (error) {
      res.status(500).json({ error: "Error creating contact", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ContactI;
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }
      if (body.empresa_id !== undefined && body.empresa_id !== null) {
        const found_empresa_id = await Company.findByPk(body.empresa_id);
        if (!found_empresa_id) {
          res.status(404).json({ error: "Company (empresa_id) not found" });
          return;
        }
      }

      await contact.update({
        empresa_id: body.empresa_id,
        nombre: body.nombre,
        cargo: body.cargo ?? contact.cargo,
        telefono: body.telefono ?? contact.telefono,
        email: body.email ?? contact.email,
        is_principal: body.is_principal ?? contact.is_principal,
        is_active: body.is_active ?? contact.is_active,
      });

      res.status(200).json({ contact: contact });
    } catch (error) {
      res.status(500).json({ error: "Error updating contact (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ContactI>;
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }

      await contact.update(body);
      res.status(200).json({ contact: contact });
    } catch (error) {
      res.status(500).json({ error: "Error updating contact (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }
      await contact.destroy();
      res.status(200).json({ message: "Contact permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting contact", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const contact = await Contact.findByPk(id);
      if (!contact) {
        res.status(404).json({ error: "Contact not found" });
        return;
      }
      await contact.update({ is_active: false });
      res.status(200).json({
        message: "Contact deactivated (logical delete)",
        contact: contact,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating contact", detail: String(error) });
    }
  }
}
EOF
```

**Routes**

```bash
: > src/features/business/contact/contact.routes.ts
cat >> src/features/business/contact/contact.routes.ts << 'EOF'
import { Application } from "express";
import { ContactController } from "./contact.controller";

export class ContactRoutes {
  public contactController: ContactController = new ContactController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/contacts")
      .get(this.contactController.getAll.bind(this.contactController));

    // getOne
    app
      .route("/api/contacts/:id")
      .get(this.contactController.getOne.bind(this.contactController));

    // create
    app
      .route("/api/contacts")
      .post(this.contactController.create.bind(this.contactController));

    // update (PUT / PATCH)
    app
      .route("/api/contacts/:id")
      .put(this.contactController.updatePut.bind(this.contactController))
      .patch(this.contactController.updatePatch.bind(this.contactController));

    // delete fisico
    app
      .route("/api/contacts/:id")
      .delete(this.contactController.deletePhysical.bind(this.contactController));

    // delete logico
    app
      .route("/api/contacts/:id/deactivate")
      .patch(this.contactController.deleteLogical.bind(this.contactController));
  }
}
EOF
```

---

## 7.3 HTTP

**GET**

```bash
: > src/features/business/contact/http/contacts.get.http
cat >> src/features/business/contact/http/contacts.get.http << 'EOF'
### Feature Contact — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllContact
GET {{baseUrl}}/api/contacts

###

# @name getOneContact
GET {{baseUrl}}/api/contacts/{{id}}
EOF
```

**CREATE**

```bash
: > src/features/business/contact/http/contacts.create.http
cat >> src/features/business/contact/http/contacts.create.http << 'EOF'
### Feature Contact — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createContact
POST {{baseUrl}}/api/contacts
Content-Type: application/json

{
  "empresa_id": 1,
  "nombre": "Ejemplo nombre",
  "cargo": "Ejemplo cargo",
  "telefono": "Ejemplo telefono",
  "email": "Ejemplo email",
  "is_principal": true,
  "is_active": true
}
EOF
```

**UPDATE**

```bash
: > src/features/business/contact/http/contacts.update.http
cat >> src/features/business/contact/http/contacts.update.http << 'EOF'
### Feature Contact — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updateContactPut
PUT {{baseUrl}}/api/contacts/{{id}}
Content-Type: application/json

{
  "empresa_id": 1,
  "nombre": "Ejemplo nombre",
  "cargo": "Ejemplo cargo",
  "telefono": "Ejemplo telefono",
  "email": "Ejemplo email",
  "is_principal": true,
  "is_active": true
}

###

# @name updateContactPatch
PATCH {{baseUrl}}/api/contacts/{{id}}
Content-Type: application/json

{
  "nombre": "Ejemplo nombre"
}

EOF
```

**DELETE**

```bash
: > src/features/business/contact/http/contacts.delete.http
cat >> src/features/business/contact/http/contacts.delete.http << 'EOF'
### Feature Contact — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteContactPhysical
DELETE {{baseUrl}}/api/contacts/{{id}}

###

# @name deleteContactLogical
PATCH {{baseUrl}}/api/contacts/{{id}}/deactivate
EOF
```

---

## 7.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { CompanyRoutes } ...`, **añadir**:

```ts
import { ContactRoutes } from "../features/business/contact/contact.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `companyRoutes`, **añadir**:

```ts
  public contactRoutes: ContactRoutes = new ContactRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/company/company.model";`, **añadir**:

```ts
import "../features/business/contact/contact.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.companyRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.contactRoutes.routes(this.app);
```

---

## 7.5 Relación / asociaciones Contact

> `Contact` referencia: **Company**. Norma FK: `<tabla_singular>_id`.

```bash
: > src/features/business/contact/contact.associations.ts
cat >> src/features/business/contact/contact.associations.ts << 'EOF'
import { Contact } from "./contact.model";
import { Company } from "../company/company.model";

Contact.belongsTo(Company, { foreignKey: "empresa_id", as: "company" });
Company.hasMany(Contact, { foreignKey: "empresa_id", as: "contacts" });
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

**Debajo de** `import "../features/business/contact/contact.model";` (y **encima de** `import { Routes }`), **añadir**:

```ts
import "../features/business/contact/contact.associations";
```

---

## 7.6 Seeder Contact

```bash
: > src/features/business/contact/contact.seeder.ts
cat >> src/features/business/contact/contact.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Contact } from "./contact.model";
import { Company } from "../companies/companies.model";

/**
 * Seeder del feature Contact (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedContacts(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  contacts: count=0, se omite");
    return 0;
  }

  const existing = await Contact.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  contacts: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const companyList = await Company.findAll({ where: { is_active: true } });
  if (companyList.length === 0) {
    console.log("\u23ed\ufe0f  contacts: faltan dependencias activas (companyList), se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
      empresa_id: faker.helpers.arrayElement(companyList).id,
      nombre: faker.person.fullName(),
      cargo: faker.person.jobTitle(),
      telefono: faker.phone.number({ style: "national" }),
      email: faker.internet.email().toLowerCase(),
      is_principal: faker.datatype.boolean(),
      is_active: true,
  }));

  await Contact.bulkCreate(rows);
  console.log(`\u2705 contacts: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```

**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `contacts: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `contacts: 15,`
- Lectura opcional por env: `SEED_CONTACTS`.

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** el import del seeder anterior, **añadir** `import { seedContacts } from "../../features/business/contact/contact.seeder";`
2. **Debajo de** `await seedCompanies(counts.companies);`, **añadir** `await seedContacts(counts.contacts);`

---

## 7.7 Swagger Contact

```bash
: > src/features/business/contact/contact.swagger.ts
cat >> src/features/business/contact/contact.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature Contact.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const contactSwagger = {
  tags: [
    {
      name: "Contacts",
      description: "CRUD de contacts — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/contacts": {
      get: {
        tags: ["Contacts"],
        summary: "Listar contacts activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de contacts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contacts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Contact" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Contacts"],
        summary: "Crear contact",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Contact creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contact: { $ref: "#/components/schemas/Contact" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/contacts/{id}": {
      get: {
        tags: ["Contacts"],
        summary: "Obtener contact por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Contact encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contact: { $ref: "#/components/schemas/Contact" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Contacts"],
        summary: "Actualizar contact (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Contacts"],
        summary: "Actualizar contact (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Contacts"],
        summary: "Eliminar contact (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/contacts/{id}/deactivate": {
      patch: {
        tags: ["Contacts"],
        summary: "Eliminar contact (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Contact: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      empresa_id: { type: "integer", example: 1 },
      nombre: { type: "string", example: "nombre" },
      cargo: { type: "string", example: "cargo" },
      telefono: { type: "string", example: "telefono" },
      email: { type: "string", example: "email" },
      is_principal: { type: "boolean", example: true },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      ContactCreate: {
        type: "object",
        required: ["empresa_id", "nombre"],
        properties: {
      empresa_id: { type: "integer", example: 1 },
      nombre: { type: "string", example: "nombre" },
      cargo: { type: "string", example: "cargo" },
      telefono: { type: "string", example: "telefono" },
      email: { type: "string", example: "email" },
      is_principal: { type: "boolean", example: true },
      is_active: { type: "boolean", example: true },
        },
      },
      ContactPatch: {
        type: "object",
        properties: {
      empresa_id: { type: "integer", example: 1 },
      nombre: { type: "string", example: "nombre" },
      cargo: { type: "string", example: "cargo" },
      telefono: { type: "string", example: "telefono" },
      email: { type: "string", example: "email" },
      is_principal: { type: "boolean", example: true },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```

**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { companySwagger } ...`

**añadir** 

`import { contactSwagger } from "../features/business/contact/contact.swagger";`

2. **Dentro de** `featureSwaggerModules`, **debajo de** `companySwagger,`

**añadir** `contactSwagger,`

### Verificación

```bash
npx tsc --noEmit
curl -s http://localhost:4000/api/contacts
```

![alt text](img-express/curl_contacts.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_contacts.png)

![alt text](img-express/contacts_docs.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

## 8. ISS-07 — Feature Address

**Objetivo:** CRUD completo + seeder + swagger de **Address** (tabla `addresses`).  
**Bloqueado por:** ISS-06.  
**API:** `/api/address` — **SIN AUTH**.  
**Patrón:** mismo que las features anteriores (modelo → controller/routes → http → cableado → relación → seeder → swagger).

### Criterios de aceptación (ISS-07)

- [ ] **8.1** Modelo `address.model.ts` (`is_active` boolean + `timestamps: true`, columnas snake_case)
- [ ] **8.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [ ] **8.3** Carpeta `http/` con get, create, update, delete
- [ ] **8.4** Cableado en `routes/index.ts` + `config/index.ts`
- [ ] **8.5** Asociaciones (`address.associations.ts`) + PARCHE `config`
- [ ] **8.6** Seeder + registro en SeedersRunner / `counts.ts`
- [ ] **8.7** Swagger + registro en `src/swagger`

---

```bash
mkdir -p \
  src/features/business/address/http
```

## 8.1 Modelo Address

```bash
: > src/features/business/address/address.model.ts
cat >> src/features/business/address/address.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface AddressI {
  id?: number;
  empresa_id: number;
  alias: string;
  linea1: string;
  linea2?: string | null;
  ciudad: string;
  departamento?: string | null;
  pais?: string | null;
  codigo_postal?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  tipo: "recogida" | "entrega" | "mixta";
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Address extends Model {
  public id!: number;
  public empresa_id!: number;
  public alias!: string;
  public linea1!: string;
  public linea2!: string | null;
  public ciudad!: string;
  public departamento!: string | null;
  public pais!: string | null;
  public codigo_postal!: string | null;
  public latitud!: number | null;
  public longitud!: number | null;
  public tipo!: "recogida" | "entrega" | "mixta";
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Address.init(
  {
    empresa_id: {
      type: DataTypes.INTEGER,
      references: { model: "companies", key: "id" },
      allowNull: false,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    linea1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    linea2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    codigo_postal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    longitud: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM("recogida", "entrega", "mixta"),
      allowNull: false,
      defaultValue: "recogida",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    timestamps: true,
  }
);
EOF
```

---

## 8.2 Controller + routes (CRUD completo)

**Controller**

```bash
: > src/features/business/address/address.controller.ts
cat >> src/features/business/address/address.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Address, AddressI } from "./address.model";
import { Company } from "../company/company.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class AddressController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const addresses = await Address.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ addresses });
    } catch (error) {
      res.status(500).json({ error: "Error fetching addresses", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const address = await Address.findByPk(id);
      if (!address) {
        res.status(404).json({ error: "Address not found" });
        return;
      }
      res.status(200).json({ address: address });
    } catch (error) {
      res.status(500).json({ error: "Error fetching address", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as AddressI;
      if (body.empresa_id !== undefined && body.empresa_id !== null) {
        const found_empresa_id = await Company.findByPk(body.empresa_id);
        if (!found_empresa_id) {
          res.status(404).json({ error: "Company (empresa_id) not found" });
          return;
        }
      }

      const address = await Address.create({
        empresa_id: body.empresa_id,
        alias: body.alias,
        linea1: body.linea1,
        linea2: body.linea2 ?? null,
        ciudad: body.ciudad,
        departamento: body.departamento ?? null,
        pais: body.pais ?? null,
        codigo_postal: body.codigo_postal ?? null,
        latitud: body.latitud ?? null,
        longitud: body.longitud ?? null,
        tipo: body.tipo,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ address: address });
    } catch (error) {
      res.status(500).json({ error: "Error creating address", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as AddressI;
      const address = await Address.findByPk(id);
      if (!address) {
        res.status(404).json({ error: "Address not found" });
        return;
      }
      if (body.empresa_id !== undefined && body.empresa_id !== null) {
        const found_empresa_id = await Company.findByPk(body.empresa_id);
        if (!found_empresa_id) {
          res.status(404).json({ error: "Company (empresa_id) not found" });
          return;
        }
      }

      await address.update({
        empresa_id: body.empresa_id,
        alias: body.alias,
        linea1: body.linea1,
        linea2: body.linea2 ?? address.linea2,
        ciudad: body.ciudad,
        departamento: body.departamento ?? address.departamento,
        pais: body.pais ?? address.pais,
        codigo_postal: body.codigo_postal ?? address.codigo_postal,
        latitud: body.latitud ?? address.latitud,
        longitud: body.longitud ?? address.longitud,
        tipo: body.tipo,
        is_active: body.is_active ?? address.is_active,
      });

      res.status(200).json({ address: address });
    } catch (error) {
      res.status(500).json({ error: "Error updating address (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<AddressI>;
      const address = await Address.findByPk(id);
      if (!address) {
        res.status(404).json({ error: "Address not found" });
        return;
      }

      await address.update(body);
      res.status(200).json({ address: address });
    } catch (error) {
      res.status(500).json({ error: "Error updating address (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const address = await Address.findByPk(id);
      if (!address) {
        res.status(404).json({ error: "Address not found" });
        return;
      }
      await address.destroy();
      res.status(200).json({ message: "Address permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting address", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const address = await Address.findByPk(id);
      if (!address) {
        res.status(404).json({ error: "Address not found" });
        return;
      }
      await address.update({ is_active: false });
      res.status(200).json({
        message: "Address deactivated (logical delete)",
        address: address,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating address", detail: String(error) });
    }
  }
}
EOF
```

**Routes**

```bash
: > src/features/business/address/address.routes.ts
cat >> src/features/business/address/address.routes.ts << 'EOF'
import { Application } from "express";
import { AddressController } from "./address.controller";

export class AddressRoutes {
  public addressController: AddressController = new AddressController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/address")
      .get(this.addressController.getAll.bind(this.addressController));

    // getOne
    app
      .route("/api/address/:id")
      .get(this.addressController.getOne.bind(this.addressController));

    // create
    app
      .route("/api/address")
      .post(this.addressController.create.bind(this.addressController));

    // update (PUT / PATCH)
    app
      .route("/api/address/:id")
      .put(this.addressController.updatePut.bind(this.addressController))
      .patch(this.addressController.updatePatch.bind(this.addressController));

    // delete fisico
    app
      .route("/api/address/:id")
      .delete(this.addressController.deletePhysical.bind(this.addressController));

    // delete logico
    app
      .route("/api/address/:id/deactivate")
      .patch(this.addressController.deleteLogical.bind(this.addressController));
  }
}
EOF
```

---

## 8.3 HTTP

**GET**

```bash
: > src/features/business/address/http/addresses.get.http
cat >> src/features/business/address/http/addresses.get.http << 'EOF'
### Feature Address — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllAddress
GET {{baseUrl}}/api/address

###

# @name getOneAddress
GET {{baseUrl}}/api/address/{{id}}
EOF
```

**CREATE**

```bash
: > src/features/business/address/http/addresses.create.http
cat >> src/features/business/address/http/addresses.create.http << 'EOF'
### Feature Address — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createAddress
POST {{baseUrl}}/api/address
Content-Type: application/json

{
  "empresa_id": 1,
  "alias": "Ejemplo alias",
  "linea1": "Ejemplo linea1",
  "linea2": "Ejemplo linea2",
  "ciudad": "Ejemplo ciudad",
  "departamento": "Ejemplo departamento",
  "pais": "Ejemplo pais",
  "codigo_postal": "Ejemplo codigo_postal",
  "latitud": 10.5,
  "longitud": 10.5,
  "tipo": "recogida",
  "is_active": true
}
EOF
```

**UPDATE**

```bash
: > src/features/business/address/http/addresses.update.http
cat >> src/features/business/address/http/addresses.update.http << 'EOF'
### Feature Address — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updateAddressPut
PUT {{baseUrl}}/api/address/{{id}}
Content-Type: application/json

{
  "empresa_id": 1,
  "alias": "Ejemplo alias",
  "linea1": "Ejemplo linea1",
  "linea2": "Ejemplo linea2",
  "ciudad": "Ejemplo ciudad",
  "departamento": "Ejemplo departamento",
  "pais": "Ejemplo pais",
  "codigo_postal": "Ejemplo codigo_postal",
  "latitud": 10.5,
  "longitud": 10.5,
  "tipo": "recogida",
  "is_active": true
}

###

# @name updateAddressPatch
PATCH {{baseUrl}}/api/address/{{id}}
Content-Type: application/json

{
  "alias": "Ejemplo alias"
}
EOF
```

**DELETE**

```bash
: > src/features/business/address/http/addresses.delete.http
cat >> src/features/business/address/http/addresses.delete.http << 'EOF'
### Feature Address — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteAddressPhysical
DELETE {{baseUrl}}/api/address/{{id}}

###

# @name deleteAddressLogical
PATCH {{baseUrl}}/api/address/{{id}}/deactivate
EOF
```

---

## 8.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { ContactRoutes } ...`, **añadir**:

```ts
import { AddressRoutes } from "../features/business/address/address.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `contactRoutes`, **añadir**:

```ts
  public addressRoutes: AddressRoutes = new AddressRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/contact/contact.model";`, **añadir**:

```ts
import "../features/business/address/address.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.contactRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.addressRoutes.routes(this.app);
```

---

## 8.5 Relación / asociaciones Address

> `Address` referencia: **Company**. Norma FK: `<tabla_singular>_id`.

```bash
: > src/features/business/address/address.associations.ts
cat >> src/features/business/address/address.associations.ts << 'EOF'
import { Address } from "./address.model";
import { Company } from "../companies/companies.model";

Address.belongsTo(Company, { foreignKey: "empresa_id", as: "company" });
Company.hasMany(Address, { foreignKey: "empresa_id", as: "addresss" });
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

**Debajo de** `import "../features/business/address/address.model";` (y **encima de** `import { Routes }`), **añadir**:

```ts
import "../features/business/address/address.associations";
```

---

## 8.6 Seeder Address

```bash
: > src/features/business/address/address.seeder.ts
cat >> src/features/business/address/address.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Address } from "./address.model";
import { Company } from "../companies/companies.model";

/**
 * Seeder del feature Address (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedAddresses(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  addresses: count=0, se omite");
    return 0;
  }

  const existing = await Address.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  addresses: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const companyList = await Company.findAll({ where: { is_active: true } });
  if (companyList.length === 0) {
    console.log("\u23ed\ufe0f  addresses: faltan dependencias activas (companyList), se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
      empresa_id: faker.helpers.arrayElement(companyList).id,
      alias: faker.commerce.department() + " " + faker.location.direction(),
      linea1: faker.location.streetAddress(),
      linea2: faker.location.secondaryAddress(),
      ciudad: faker.location.city(),
      departamento: faker.location.state(),
      pais: faker.location.country(),
      codigo_postal: faker.location.zipCode(),
      latitud: Number(faker.location.latitude()),
      longitud: Number(faker.location.longitude()),
      tipo: faker.helpers.arrayElement(["recogida", "entrega", "mixta"]),
      is_active: true,
  }));

  await Address.bulkCreate(rows);
  console.log(`\u2705 addresses: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```

**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `addresses: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `addresses: 15,`
- Lectura opcional por env: `SEED_ADDRESSES`.

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** el import del seeder anterior, **añadir** `import { seedAddresses } from "../../features/business/address/address.seeder";`
2. **Debajo de** `await seedContacts(counts.contacts);`, **añadir** `await seedAddresses(counts.addresses);`

---

## 8.7 Swagger Address

```bash
: > src/features/business/address/address.swagger.ts
cat >> src/features/business/address/address.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature Address.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const addressSwagger = {
  tags: [
    {
      name: "Addresses",
      description: "CRUD de addresses — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/address": {
      get: {
        tags: ["Addresses"],
        summary: "Listar addresses activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de addresses",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    addresses: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Address" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Addresses"],
        summary: "Crear address",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddressCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Address creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    address: { $ref: "#/components/schemas/Address" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/address/{id}": {
      get: {
        tags: ["Addresses"],
        summary: "Obtener address por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Address encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    address: { $ref: "#/components/schemas/Address" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Addresses"],
        summary: "Actualizar address (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddressCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Addresses"],
        summary: "Actualizar address (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddressPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Addresses"],
        summary: "Eliminar address (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/address/{id}/deactivate": {
      patch: {
        tags: ["Addresses"],
        summary: "Eliminar address (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Address: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      empresa_id: { type: "integer", example: 1 },
      alias: { type: "string", example: "alias" },
      linea1: { type: "string", example: "linea1" },
      linea2: { type: "string", example: "linea2" },
      ciudad: { type: "string", example: "ciudad" },
      departamento: { type: "string", example: "departamento" },
      pais: { type: "string", example: "pais" },
      codigo_postal: { type: "string", example: "codigo_postal" },
      latitud: { type: "number", example: 10.5 },
      longitud: { type: "number", example: 10.5 },
      tipo: { type: "string", enum: ["recogida", "entrega", "mixta"], example: "recogida" },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      AddressCreate: {
        type: "object",
        required: ["empresa_id", "alias", "linea1", "ciudad", "tipo"],
        properties: {
      empresa_id: { type: "integer", example: 1 },
      alias: { type: "string", example: "alias" },
      linea1: { type: "string", example: "linea1" },
      linea2: { type: "string", example: "linea2" },
      ciudad: { type: "string", example: "ciudad" },
      departamento: { type: "string", example: "departamento" },
      pais: { type: "string", example: "pais" },
      codigo_postal: { type: "string", example: "codigo_postal" },
      latitud: { type: "number", example: 10.5 },
      longitud: { type: "number", example: 10.5 },
      tipo: { type: "string", enum: ["recogida", "entrega", "mixta"], example: "recogida" },
      is_active: { type: "boolean", example: true },
        },
      },
      AddressPatch: {
        type: "object",
        properties: {
      empresa_id: { type: "integer", example: 1 },
      alias: { type: "string", example: "alias" },
      linea1: { type: "string", example: "linea1" },
      linea2: { type: "string", example: "linea2" },
      ciudad: { type: "string", example: "ciudad" },
      departamento: { type: "string", example: "departamento" },
      pais: { type: "string", example: "pais" },
      codigo_postal: { type: "string", example: "codigo_postal" },
      latitud: { type: "number", example: 10.5 },
      longitud: { type: "number", example: 10.5 },
      tipo: { type: "string", enum: ["recogida", "entrega", "mixta"], example: "recogida" },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```
**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { contactSwagger } ...`, **añadir** `import { addressSwagger } from "../features/business/address/address.swagger";`
2. **Dentro de** `featureSwaggerModules`, **debajo de** `contactSwagger,`, **añadir** `addressSwagger,`

### Verificación

```bash
npx tsc --noEmit
curl -s http://localhost:4000/api/address
```

![alt text](img-express/curl_address.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_address.png)

![alt text](img-express/address_docs.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

## 9. ISS-08 — PARCHE — Relación Company ↔ Contact / Address

**Objetivo:** cerrar el ciclo Company↔Contact↔Address. `Company` (Empresa) referencia a `Contact` (`contacto_principal_id`) y a `Address` (`direccion_facturacion_id`), pero ambas tablas dependían de `Company` (`empresa_id`) y no existían todavía cuando se creó `company.model.ts` (ISS-03). Con `Contact` (ISS-06) y `Address` (ISS-07) ya creadas, se agregan ahora las dos columnas FK que faltaban en `companies` mediante **PARCHE**.  
**Bloqueado por:** ISS-07.

### Criterios de aceptación (ISS-08)

- [X] **9.1** `company.model.ts` con `contacto_principal_id` y `direccion_facturacion_id` (nullable, FK)
- [X] **9.2** `company.associations.ts` (`belongsTo` hacia `Contact` y `Address`)
- [X] **9.3** `config/index.ts` importa `company.associations`
- [X] `npx tsc --noEmit` OK y `npm run dev` sincroniza sin error

---

## 9.1 PARCHE — `company.model.ts`

**PARCHE** — `src/features/business/company/company.model.ts` **ya existe** (ISS-03).

**Dentro de** la interfaz `CompanyI`, **debajo de** `razon_social: string;`, **añadir**:

```ts
  contacto_principal_id?: number | null;
  direccion_facturacion_id?: number | null;
```

**Dentro de** la clase `Company`, **debajo de** `public razon_social!: string;`, **añadir**:

```ts
  public contacto_principal_id!: number | null;
  public direccion_facturacion_id!: number | null;
```

**Dentro de** `Company.init({ ... })`, **debajo de** la columna `razon_social`, **añadir**:

```ts
  contacto_principal_id: {
    type: DataTypes.INTEGER,
    references: { model: "contacts", key: "id" },
    allowNull: true,
  },
  direccion_facturacion_id: {
    type: DataTypes.INTEGER,
    references: { model: "addresses", key: "id" },
    allowNull: true,
  },
```

También **añadir** ambos campos al `create` / `updatePut` del controller (`company.controller.ts`), igual que el resto de columnas (`body.contacto_principal_id ?? null`, `body.direccion_facturacion_id ?? null`).

---

## 9.2 Asociaciones Company ↔ Contact / Address

```bash
: > src/features/business/companies/company.associations.ts
cat >> src/features/business/companies/company.associations.ts << 'EOF'
import { Company } from "./companies.model";
import { Contact } from "../contact/contact.model";
import { Address } from "../address/address.model";

Company.belongsTo(Contact, { foreignKey: "contacto_principal_id", as: "contacto_principal" });
Company.belongsTo(Address, { foreignKey: "direccion_facturacion_id", as: "direccion_facturacion" });
EOF
```
---

## 9.3 PARCHE — `config/index.ts`

**Debajo de** `import "../features/business/address/address.associations";` (o el último import de asociaciones existente), **añadir**:

```ts
import "../features/business/companies/company.associations";
```

### Verificación

```bash
npx tsc --noEmit
curl -s -X PATCH http://localhost:4000/api/companies/1 \
  -H 'Content-Type: application/json' \
  -d '{"contacto_principal_id":1,"direccion_facturacion_id":1}'
```

![alt text](img-express/patch_company.png)

### Cierre del ISS
```bash
npm run dev
```

![alt text](img-express/run_Company_Contact.png)

---

## 10. ISS-09 — Feature Messenger

**Objetivo:** CRUD completo + seeder + swagger de **Messenger** (tabla `messengers`).  
**Bloqueado por:** ISS-08.  
**API:** `/api/messengers` — **SIN AUTH**.  
**Patrón:** mismo que las features anteriores (modelo → controller/routes → http → cableado → seeder → swagger).

### Criterios de aceptación (ISS-09)

- [X] **10.1** Modelo `messenger.model.ts` (`is_active` boolean + `timestamps: true`, columnas snake_case)
- [X] **10.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [X] **10.3** Carpeta `http/` con get, create, update, delete
- [X] **10.4** Cableado en `routes/index.ts` + `config/index.ts`
- [X] **10.5** Seeder + registro en SeedersRunner / `counts.ts`
- [X] **10.6** Swagger + registro en `src/swagger`

---

```bash
mkdir -p \
  src/features/business/messenger/http
```

## 10.1 Modelo Messenger

```bash
: > src/features/business/messenger/messenger.model.ts
cat >> src/features/business/messenger/messenger.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface MessengerI {
  id?: number;
  nombre: string;
  documento_identidad: string;
  telefono?: string | null;
  tipo_vehiculo: "moto" | "carro" | "bicicleta" | "a_pie";
  placa_vehiculo?: string | null;
  zona_asignada?: string | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Messenger extends Model {
  public id!: number;
  public nombre!: string;
  public documento_identidad!: string;
  public telefono!: string | null;
  public tipo_vehiculo!: "moto" | "carro" | "bicicleta" | "a_pie";
  public placa_vehiculo!: string | null;
  public zona_asignada!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Messenger.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documento_identidad: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipo_vehiculo: {
      type: DataTypes.ENUM("moto", "carro", "bicicleta", "a_pie"),
      allowNull: false,
      defaultValue: "moto",
    },
    placa_vehiculo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zona_asignada: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Messenger",
    tableName: "messengers",
    timestamps: true,
  }
);
EOF
```

---

## 10.2 Controller + routes (CRUD completo)

```bash
: > src/features/business/messenger/messenger.controller.ts
cat >> src/features/business/messenger/messenger.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Messenger, MessengerI } from "./messenger.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class MessengerController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const messengers = await Messenger.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ messengers });
    } catch (error) {
      res.status(500).json({ error: "Error fetching messengers", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }
      res.status(200).json({ messenger: messenger });
    } catch (error) {
      res.status(500).json({ error: "Error fetching messenger", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as MessengerI;


      const messenger = await Messenger.create({
        nombre: body.nombre,
        documento_identidad: body.documento_identidad,
        telefono: body.telefono ?? null,
        tipo_vehiculo: body.tipo_vehiculo,
        placa_vehiculo: body.placa_vehiculo ?? null,
        zona_asignada: body.zona_asignada ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ messenger: messenger });
    } catch (error) {
      res.status(500).json({ error: "Error creating messenger", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as MessengerI;
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }


      await messenger.update({
        nombre: body.nombre,
        documento_identidad: body.documento_identidad,
        telefono: body.telefono ?? messenger.telefono,
        tipo_vehiculo: body.tipo_vehiculo,
        placa_vehiculo: body.placa_vehiculo ?? messenger.placa_vehiculo,
        zona_asignada: body.zona_asignada ?? messenger.zona_asignada,
        is_active: body.is_active ?? messenger.is_active,
      });

      res.status(200).json({ messenger: messenger });
    } catch (error) {
      res.status(500).json({ error: "Error updating messenger (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<MessengerI>;
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }

      await messenger.update(body);
      res.status(200).json({ messenger: messenger });
    } catch (error) {
      res.status(500).json({ error: "Error updating messenger (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }
      await messenger.destroy();
      res.status(200).json({ message: "Messenger permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting messenger", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const messenger = await Messenger.findByPk(id);
      if (!messenger) {
        res.status(404).json({ error: "Messenger not found" });
        return;
      }
      await messenger.update({ is_active: false });
      res.status(200).json({
        message: "Messenger deactivated (logical delete)",
        messenger: messenger,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating messenger", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/messenger/messenger.routes.ts
cat >> src/features/business/messenger/messenger.routes.ts << 'EOF'
import { Application } from "express";
import { MessengerController } from "./messenger.controller";

export class MessengerRoutes {
  public messengerController: MessengerController = new MessengerController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/messengers")
      .get(this.messengerController.getAll.bind(this.messengerController));

    // getOne
    app
      .route("/api/messengers/:id")
      .get(this.messengerController.getOne.bind(this.messengerController));

    // create
    app
      .route("/api/messengers")
      .post(this.messengerController.create.bind(this.messengerController));

    // update (PUT / PATCH)
    app
      .route("/api/messengers/:id")
      .put(this.messengerController.updatePut.bind(this.messengerController))
      .patch(this.messengerController.updatePatch.bind(this.messengerController));

    // delete fisico
    app
      .route("/api/messengers/:id")
      .delete(this.messengerController.deletePhysical.bind(this.messengerController));

    // delete logico
    app
      .route("/api/messengers/:id/deactivate")
      .patch(this.messengerController.deleteLogical.bind(this.messengerController));
  }
}
EOF
```

---

## 10.3 HTTP

```bash
: > src/features/business/messenger/http/messengers.get.http
cat >> src/features/business/messenger/http/messengers.get.http << 'EOF'
### Feature Messenger — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllMessenger
GET {{baseUrl}}/api/messengers

###

# @name getOneMessenger
GET {{baseUrl}}/api/messengers/{{id}}
EOF
```
```bash
: > src/features/business/messenger/http/messengers.create.http
cat >> src/features/business/messenger/http/messengers.create.http << 'EOF'
### Feature Messenger — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createMessenger
POST {{baseUrl}}/api/messengers
Content-Type: application/json

{
  "nombre": "Ejemplo nombre",
  "documento_identidad": "Ejemplo documento_identidad",
  "telefono": "Ejemplo telefono",
  "tipo_vehiculo": "moto",
  "placa_vehiculo": "Ejemplo placa_vehiculo",
  "zona_asignada": "Ejemplo zona_asignada",
  "is_active": true
}
EOF
```
```bash
: > src/features/business/messenger/http/messengers.update.http
cat >> src/features/business/messenger/http/messengers.update.http << 'EOF'
### Feature Messenger — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updateMessengerPut
PUT {{baseUrl}}/api/messengers/{{id}}
Content-Type: application/json

{
  "nombre": "Ejemplo nombre",
  "documento_identidad": "Ejemplo documento_identidad",
  "telefono": "Ejemplo telefono",
  "tipo_vehiculo": "moto",
  "placa_vehiculo": "Ejemplo placa_vehiculo",
  "zona_asignada": "Ejemplo zona_asignada",
  "is_active": true
}

###

# @name updateMessengerPatch
PATCH {{baseUrl}}/api/messengers/{{id}}
Content-Type: application/json

{
  "documento_identidad": "Ejemplo documento_identidad"
}
EOF
```
```bash
: > src/features/business/messenger/http/messengers.delete.http
cat >> src/features/business/messenger/http/messengers.delete.http << 'EOF'
### Feature Messenger — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteMessengerPhysical
DELETE {{baseUrl}}/api/messengers/{{id}}

###

# @name deleteMessengerLogical
PATCH {{baseUrl}}/api/messengers/{{id}}/deactivate
EOF
```

---

## 10.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { AddressRoutes } ...`, **añadir**:

```ts
import { MessengerRoutes } from "../features/business/messenger/messenger.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `addressRoutes`, **añadir**:

```ts
  public messengerRoutes: MessengerRoutes = new MessengerRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/address/address.model";`, **añadir**:

```ts
import "../features/business/messenger/messenger.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.addressRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.messengerRoutes.routes(this.app);
```

---

## 10.5 Seeder Messenger

```bash
: > src/features/business/messenger/messenger.seeder.ts
cat >> src/features/business/messenger/messenger.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Messenger } from "./messenger.model";


/**
 * Seeder del feature Messenger (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedMessengers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  messengers: count=0, se omite");
    return 0;
  }

  const existing = await Messenger.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  messengers: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }




  const rows = Array.from({ length: count }, () => ({
      nombre: faker.person.fullName(),
      documento_identidad: faker.string.numeric(10),
      telefono: faker.phone.number({ style: "national" }),
      tipo_vehiculo: faker.helpers.arrayElement(["moto", "carro", "bicicleta", "a_pie"]),
      placa_vehiculo: faker.vehicle.vrm(),
      zona_asignada: faker.location.city(),
      is_active: true,
  }));

  await Messenger.bulkCreate(rows);
  console.log(`\u2705 messengers: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```
**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `messengers: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `messengers: 15,`
- Lectura opcional por env: `SEED_MESSENGERS`.

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** el import del seeder anterior, **añadir** `import { seedMessengers } from "../../features/business/messenger/messenger.seeder";`
2. **Debajo de** `await seedAddresses(counts.addresses);`, **añadir** `await seedMessengers(counts.messengers);`

---

## 10.6 Swagger Messenger

```bash
: > src/features/business/messenger/messenger.swagger.ts
cat >> src/features/business/messenger/messenger.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature Messenger.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const messengerSwagger = {
  tags: [
    {
      name: "Messengers",
      description: "CRUD de messengers — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/messengers": {
      get: {
        tags: ["Messengers"],
        summary: "Listar messengers activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de messengers",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messengers: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Messenger" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Messengers"],
        summary: "Crear messenger",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessengerCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Messenger creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messenger: { $ref: "#/components/schemas/Messenger" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/messengers/{id}": {
      get: {
        tags: ["Messengers"],
        summary: "Obtener messenger por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Messenger encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messenger: { $ref: "#/components/schemas/Messenger" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Messengers"],
        summary: "Actualizar messenger (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessengerCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Messengers"],
        summary: "Actualizar messenger (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessengerPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Messengers"],
        summary: "Eliminar messenger (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/messengers/{id}/deactivate": {
      patch: {
        tags: ["Messengers"],
        summary: "Eliminar messenger (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Messenger: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      nombre: { type: "string", example: "nombre" },
      documento_identidad: { type: "string", example: "documento_identidad" },
      telefono: { type: "string", example: "telefono" },
      tipo_vehiculo: { type: "string", enum: ["moto", "carro", "bicicleta", "a_pie"], example: "moto" },
      placa_vehiculo: { type: "string", example: "placa_vehiculo" },
      zona_asignada: { type: "string", example: "zona_asignada" },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      MessengerCreate: {
        type: "object",
        required: ["nombre", "documento_identidad", "tipo_vehiculo"],
        properties: {
      nombre: { type: "string", example: "nombre" },
      documento_identidad: { type: "string", example: "documento_identidad" },
      telefono: { type: "string", example: "telefono" },
      tipo_vehiculo: { type: "string", enum: ["moto", "carro", "bicicleta", "a_pie"], example: "moto" },
      placa_vehiculo: { type: "string", example: "placa_vehiculo" },
      zona_asignada: { type: "string", example: "zona_asignada" },
      is_active: { type: "boolean", example: true },
        },
      },
      MessengerPatch: {
        type: "object",
        properties: {
      nombre: { type: "string", example: "nombre" },
      documento_identidad: { type: "string", example: "documento_identidad" },
      telefono: { type: "string", example: "telefono" },
      tipo_vehiculo: { type: "string", enum: ["moto", "carro", "bicicleta", "a_pie"], example: "moto" },
      placa_vehiculo: { type: "string", example: "placa_vehiculo" },
      zona_asignada: { type: "string", example: "zona_asignada" },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```
**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { addressSwagger } ...`, **añadir** `import { messengerSwagger } from "../features/business/messenger/messenger.swagger";`
2. **Dentro de** `featureSwaggerModules`, **debajo de** `addressSwagger,`, **añadir** `messengerSwagger,`

### Verificación

```bash
curl -s http://localhost:4000/api/messengers
```

![alt text](img-express/api_messengers.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_messenger.png)

![alt text](img-express/docs_messenger.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

## 11. ISS-10 — Feature Rate

**Objetivo:** CRUD completo + seeder + swagger de **Rate** (tabla `rates`).  
**Bloqueado por:** ISS-09.  
**API:** `/api/rates` — **SIN AUTH**.  
**Patrón:** mismo que las features anteriores (modelo → controller/routes → http → cableado → seeder → swagger).

### Criterios de aceptación (ISS-10)

- [X] **11.1** Modelo `rate.model.ts` (`is_active` boolean + `timestamps: true`, columnas snake_case)
- [X] **11.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [X] **11.3** Carpeta `http/` con get, create, update, delete
- [X] **11.4** Cableado en `routes/index.ts` + `config/index.ts`
- [X] **11.5** Seeder + registro en SeedersRunner / `counts.ts`
- [X] **11.6** Swagger + registro en `src/swagger`

---

```bash
mkdir -p \
  src/features/business/rate/http
```

## 11.1 Modelo Rate

```bash
: > src/features/business/rate/rate.model.ts
cat >> src/features/business/rate/rate.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface RateI {
  id?: number;
  nombre: string;
  zona: string;
  regla_calculo: "por_peso" | "por_zona" | "plana";
  valor_base: number;
  valor_por_kg_adicional?: number | null;
  recargo_urgente_pct?: number | null;
  vigencia_desde: string;
  vigencia_hasta?: string | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Rate extends Model {
  public id!: number;
  public nombre!: string;
  public zona!: string;
  public regla_calculo!: "por_peso" | "por_zona" | "plana";
  public valor_base!: number;
  public valor_por_kg_adicional!: number | null;
  public recargo_urgente_pct!: number | null;
  public vigencia_desde!: string;
  public vigencia_hasta!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Rate.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zona: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regla_calculo: {
      type: DataTypes.ENUM("por_peso", "por_zona", "plana"),
      allowNull: false,
      defaultValue: "por_peso",
    },
    valor_base: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    valor_por_kg_adicional: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    recargo_urgente_pct: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    vigencia_desde: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    vigencia_hasta: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Rate",
    tableName: "rates",
    timestamps: true,
  }
);
EOF
```

---

## 11.2 Controller + routes (CRUD completo)

```bash
: > src/features/business/rate/rate.controller.ts
cat >> src/features/business/rate/rate.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Rate, RateI } from "./rate.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class RateController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const rates = await Rate.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ rates });
    } catch (error) {
      res.status(500).json({ error: "Error fetching rates", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }
      res.status(200).json({ rate: rate });
    } catch (error) {
      res.status(500).json({ error: "Error fetching rate", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as RateI;


      const rate = await Rate.create({
        nombre: body.nombre,
        zona: body.zona,
        regla_calculo: body.regla_calculo,
        valor_base: body.valor_base,
        valor_por_kg_adicional: body.valor_por_kg_adicional ?? null,
        recargo_urgente_pct: body.recargo_urgente_pct ?? null,
        vigencia_desde: body.vigencia_desde,
        vigencia_hasta: body.vigencia_hasta ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ rate: rate });
    } catch (error) {
      res.status(500).json({ error: "Error creating rate", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as RateI;
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }


      await rate.update({
        nombre: body.nombre,
        zona: body.zona,
        regla_calculo: body.regla_calculo,
        valor_base: body.valor_base,
        valor_por_kg_adicional: body.valor_por_kg_adicional ?? rate.valor_por_kg_adicional,
        recargo_urgente_pct: body.recargo_urgente_pct ?? rate.recargo_urgente_pct,
        vigencia_desde: body.vigencia_desde,
        vigencia_hasta: body.vigencia_hasta ?? rate.vigencia_hasta,
        is_active: body.is_active ?? rate.is_active,
      });

      res.status(200).json({ rate: rate });
    } catch (error) {
      res.status(500).json({ error: "Error updating rate (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<RateI>;
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }

      await rate.update(body);
      res.status(200).json({ rate: rate });
    } catch (error) {
      res.status(500).json({ error: "Error updating rate (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }
      await rate.destroy();
      res.status(200).json({ message: "Rate permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting rate", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const rate = await Rate.findByPk(id);
      if (!rate) {
        res.status(404).json({ error: "Rate not found" });
        return;
      }
      await rate.update({ is_active: false });
      res.status(200).json({
        message: "Rate deactivated (logical delete)",
        rate: rate,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating rate", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/rate/rate.routes.ts
cat >> src/features/business/rate/rate.routes.ts << 'EOF'
import { Application } from "express";
import { RateController } from "./rate.controller";

export class RateRoutes {
  public rateController: RateController = new RateController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/rates")
      .get(this.rateController.getAll.bind(this.rateController));

    // getOne
    app
      .route("/api/rates/:id")
      .get(this.rateController.getOne.bind(this.rateController));

    // create
    app
      .route("/api/rates")
      .post(this.rateController.create.bind(this.rateController));

    // update (PUT / PATCH)
    app
      .route("/api/rates/:id")
      .put(this.rateController.updatePut.bind(this.rateController))
      .patch(this.rateController.updatePatch.bind(this.rateController));

    // delete fisico
    app
      .route("/api/rates/:id")
      .delete(this.rateController.deletePhysical.bind(this.rateController));

    // delete logico
    app
      .route("/api/rates/:id/deactivate")
      .patch(this.rateController.deleteLogical.bind(this.rateController));
  }
}
EOF
```

---

## 11.3 HTTP

```bash
: > src/features/business/rate/http/rates.get.http
cat >> src/features/business/rate/http/rates.get.http << 'EOF'
### Feature Rate — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllRate
GET {{baseUrl}}/api/rates

###

# @name getOneRate
GET {{baseUrl}}/api/rates/{{id}}
EOF
```
```bash
: > src/features/business/rate/http/rates.create.http
cat >> src/features/business/rate/http/rates.create.http << 'EOF'
### Feature Rate — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createRate
POST {{baseUrl}}/api/rates
Content-Type: application/json

{
  "nombre": "Ejemplo nombre",
  "zona": "Ejemplo zona",
  "regla_calculo": "por_peso",
  "valor_base": 10.5,
  "valor_por_kg_adicional": 10.5,
  "recargo_urgente_pct": 10.5,
  "vigencia_desde": "2026-01-15",
  "vigencia_hasta": "2026-01-15",
  "is_active": true
}
EOF
```
```bash
: > src/features/business/rate/http/rates.update.http
cat >> src/features/business/rate/http/rates.update.http << 'EOF'
### Feature Rate — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updateRatePut
PUT {{baseUrl}}/api/rates/{{id}}
Content-Type: application/json

{
  "nombre": "Ejemplo nombre",
  "zona": "Ejemplo zona",
  "regla_calculo": "por_peso",
  "valor_base": 10.5,
  "valor_por_kg_adicional": 10.5,
  "recargo_urgente_pct": 10.5,
  "vigencia_desde": "2026-01-15",
  "vigencia_hasta": "2026-01-15",
  "is_active": true
}

###

# @name updateRatePatch
PATCH {{baseUrl}}/api/rates/{{id}}
Content-Type: application/json

{
  "zona": "Ejemplo zona"
}
EOF
```
```bash
: > src/features/business/rate/http/rates.delete.http
cat >> src/features/business/rate/http/rates.delete.http << 'EOF'
### Feature Rate — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteRatePhysical
DELETE {{baseUrl}}/api/rates/{{id}}

###

# @name deleteRateLogical
PATCH {{baseUrl}}/api/rates/{{id}}/deactivate
EOF
```

---

## 11.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { MessengerRoutes } ...`, **añadir**:

```ts
import { RateRoutes } from "../features/business/rate/rate.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `messengerRoutes`, **añadir**:

```ts
  public rateRoutes: RateRoutes = new RateRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/messenger/messenger.model";`, **añadir**:

```ts
import "../features/business/rate/rate.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.messengerRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.rateRoutes.routes(this.app);
```

---

## 11.5 Seeder Rate

```bash
: > src/features/business/rate/rate.seeder.ts
cat >> src/features/business/rate/rate.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Rate } from "./rate.model";


/**
 * Seeder del feature Rate (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedRates(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  rates: count=0, se omite");
    return 0;
  }

  const existing = await Rate.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  rates: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }




  const rows = Array.from({ length: count }, () => ({
      nombre: faker.commerce.productAdjective() + " " + faker.word.noun(),
      zona: faker.location.city(),
      regla_calculo: faker.helpers.arrayElement(["por_peso", "por_zona", "plana"]),
      valor_base: Number(faker.commerce.price({ min: 5000, max: 20000, dec: 2 })),
      valor_por_kg_adicional: Number(faker.commerce.price({ min: 500, max: 3000, dec: 2 })),
      recargo_urgente_pct: Number(faker.commerce.price({ min: 5, max: 40, dec: 2 })),
      vigencia_desde: faker.date.past().toISOString().slice(0, 10),
      vigencia_hasta: faker.date.recent().toISOString().slice(0, 10),
      is_active: true,
  }));

  await Rate.bulkCreate(rows);
  console.log(`\u2705 rates: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```
**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `rates: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `rates: 15,`
- Lectura opcional por env: `SEED_RATES`.

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** el import del seeder anterior, **añadir** `import { seedRates } from "../../features/business/rate/rate.seeder";`
2. **Debajo de** `await seedMessengers(counts.messengers);`, **añadir** `await seedRates(counts.rates);`

---

## 11.6 Swagger Rate

```bash
: > src/features/business/rate/rate.swagger.ts
cat >> src/features/business/rate/rate.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature Rate.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const rateSwagger = {
  tags: [
    {
      name: "Rates",
      description: "CRUD de rates — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/rates": {
      get: {
        tags: ["Rates"],
        summary: "Listar rates activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de rates",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rates: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Rate" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Rates"],
        summary: "Crear rate",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RateCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Rate creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rate: { $ref: "#/components/schemas/Rate" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/rates/{id}": {
      get: {
        tags: ["Rates"],
        summary: "Obtener rate por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Rate encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    rate: { $ref: "#/components/schemas/Rate" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Rates"],
        summary: "Actualizar rate (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RateCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Rates"],
        summary: "Actualizar rate (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RatePatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Rates"],
        summary: "Eliminar rate (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/rates/{id}/deactivate": {
      patch: {
        tags: ["Rates"],
        summary: "Eliminar rate (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Rate: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      nombre: { type: "string", example: "nombre" },
      zona: { type: "string", example: "zona" },
      regla_calculo: { type: "string", enum: ["por_peso", "por_zona", "plana"], example: "por_peso" },
      valor_base: { type: "number", example: 10.5 },
      valor_por_kg_adicional: { type: "number", example: 10.5 },
      recargo_urgente_pct: { type: "number", example: 10.5 },
      vigencia_desde: { type: "string", format: "date", example: "2026-01-15" },
      vigencia_hasta: { type: "string", format: "date", example: "2026-01-15" },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      RateCreate: {
        type: "object",
        required: ["nombre", "zona", "regla_calculo", "valor_base", "vigencia_desde"],
        properties: {
      nombre: { type: "string", example: "nombre" },
      zona: { type: "string", example: "zona" },
      regla_calculo: { type: "string", enum: ["por_peso", "por_zona", "plana"], example: "por_peso" },
      valor_base: { type: "number", example: 10.5 },
      valor_por_kg_adicional: { type: "number", example: 10.5 },
      recargo_urgente_pct: { type: "number", example: 10.5 },
      vigencia_desde: { type: "string", format: "date", example: "2026-01-15" },
      vigencia_hasta: { type: "string", format: "date", example: "2026-01-15" },
      is_active: { type: "boolean", example: true },
        },
      },
      RatePatch: {
        type: "object",
        properties: {
      nombre: { type: "string", example: "nombre" },
      zona: { type: "string", example: "zona" },
      regla_calculo: { type: "string", enum: ["por_peso", "por_zona", "plana"], example: "por_peso" },
      valor_base: { type: "number", example: 10.5 },
      valor_por_kg_adicional: { type: "number", example: 10.5 },
      recargo_urgente_pct: { type: "number", example: 10.5 },
      vigencia_desde: { type: "string", format: "date", example: "2026-01-15" },
      vigencia_hasta: { type: "string", format: "date", example: "2026-01-15" },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```
**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { messengerSwagger } ...`, **añadir** `import { rateSwagger } from "../features/business/rate/rate.swagger";`
2. **Dentro de** `featureSwaggerModules`, **debajo de** `messengerSwagger,`, **añadir** `rateSwagger,`

### Verificación

```bash
curl -s http://localhost:4000/api/rates
```

![alt text](img-express/api_rates.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_rates.png)

![alt text](img-express/docs_rates.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

## 12. ISS-11 — Feature Route

**Objetivo:** CRUD completo + seeder + swagger de **Route** (tabla `routes`).  
**Bloqueado por:** ISS-10.  
**API:** `/api/routes` — **SIN AUTH**.  
**Patrón:** mismo que las features anteriores (modelo → controller/routes → http → cableado → relación → seeder → swagger).

### Criterios de aceptación (ISS-11)

- [X] **12.1** Modelo `route.model.ts` (`is_active` boolean + `timestamps: true`, columnas snake_case)
- [X] **12.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [X] **12.3** Carpeta `http/` con get, create, update, delete
- [X] **12.4** Cableado en `routes/index.ts` + `config/index.ts`
- [X] **12.5** Asociaciones (`route.associations.ts`) + PARCHE `config`
- [X] **12.6** Seeder + registro en SeedersRunner / `counts.ts`
- [X] **12.7** Swagger + registro en `src/swagger`

---

```bash
mkdir -p \
  src/features/business/route/http
```

## 12.1 Modelo Route

```bash
: > src/features/business/route/route.model.ts
cat >> src/features/business/route/route.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface RouteI {
  id?: number;
  nombre: string;
  mensajero_id: number;
  zona_cobertura?: string | null;
  fecha: string;
  hora_inicio?: Date | string | null;
  hora_fin?: Date | string | null;
  estado: "planificada" | "en_curso" | "finalizada";
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Route extends Model {
  public id!: number;
  public nombre!: string;
  public mensajero_id!: number;
  public zona_cobertura!: string | null;
  public fecha!: string;
  public hora_inicio!: Date | string | null;
  public hora_fin!: Date | string | null;
  public estado!: "planificada" | "en_curso" | "finalizada";
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Route.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mensajero_id: {
      type: DataTypes.INTEGER,
      references: { model: "messengers", key: "id" },
      allowNull: false,
    },
    zona_cobertura: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    hora_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("planificada", "en_curso", "finalizada"),
      allowNull: false,
      defaultValue: "planificada",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Route",
    tableName: "routes",
    timestamps: true,
  }
);
EOF
```

---

## 12.2 Controller + routes (CRUD completo)

```bash
: > src/features/business/route/route.controller.ts
cat >> src/features/business/route/route.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Route, RouteI } from "./route.model";
import { Messenger } from "../messenger/messenger.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class RouteController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const routes = await Route.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ routes });
    } catch (error) {
      res.status(500).json({ error: "Error fetching routes", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }
      res.status(200).json({ route: route });
    } catch (error) {
      res.status(500).json({ error: "Error fetching route", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as RouteI;
      if (body.mensajero_id !== undefined && body.mensajero_id !== null) {
        const found_mensajero_id = await Messenger.findByPk(body.mensajero_id);
        if (!found_mensajero_id) {
          res.status(404).json({ error: "Messenger (mensajero_id) not found" });
          return;
        }
      }

      const route = await Route.create({
        nombre: body.nombre,
        mensajero_id: body.mensajero_id,
        zona_cobertura: body.zona_cobertura ?? null,
        fecha: body.fecha,
        hora_inicio: body.hora_inicio ?? null,
        hora_fin: body.hora_fin ?? null,
        estado: body.estado,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ route: route });
    } catch (error) {
      res.status(500).json({ error: "Error creating route", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as RouteI;
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }
      if (body.mensajero_id !== undefined && body.mensajero_id !== null) {
        const found_mensajero_id = await Messenger.findByPk(body.mensajero_id);
        if (!found_mensajero_id) {
          res.status(404).json({ error: "Messenger (mensajero_id) not found" });
          return;
        }
      }

      await route.update({
        nombre: body.nombre,
        mensajero_id: body.mensajero_id,
        zona_cobertura: body.zona_cobertura ?? route.zona_cobertura,
        fecha: body.fecha,
        hora_inicio: body.hora_inicio ?? route.hora_inicio,
        hora_fin: body.hora_fin ?? route.hora_fin,
        estado: body.estado,
        is_active: body.is_active ?? route.is_active,
      });

      res.status(200).json({ route: route });
    } catch (error) {
      res.status(500).json({ error: "Error updating route (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<RouteI>;
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }

      await route.update(body);
      res.status(200).json({ route: route });
    } catch (error) {
      res.status(500).json({ error: "Error updating route (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }
      await route.destroy();
      res.status(200).json({ message: "Route permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting route", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const route = await Route.findByPk(id);
      if (!route) {
        res.status(404).json({ error: "Route not found" });
        return;
      }
      await route.update({ is_active: false });
      res.status(200).json({
        message: "Route deactivated (logical delete)",
        route: route,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating route", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/route/route.routes.ts
cat >> src/features/business/route/route.routes.ts << 'EOF'
import { Application } from "express";
import { RouteController } from "./route.controller";

export class RouteRoutes {
  public routeController: RouteController = new RouteController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/routes")
      .get(this.routeController.getAll.bind(this.routeController));

    // getOne
    app
      .route("/api/routes/:id")
      .get(this.routeController.getOne.bind(this.routeController));

    // create
    app
      .route("/api/routes")
      .post(this.routeController.create.bind(this.routeController));

    // update (PUT / PATCH)
    app
      .route("/api/routes/:id")
      .put(this.routeController.updatePut.bind(this.routeController))
      .patch(this.routeController.updatePatch.bind(this.routeController));

    // delete fisico
    app
      .route("/api/routes/:id")
      .delete(this.routeController.deletePhysical.bind(this.routeController));

    // delete logico
    app
      .route("/api/routes/:id/deactivate")
      .patch(this.routeController.deleteLogical.bind(this.routeController));
  }
}
EOF
```

---

## 12.3 HTTP

```bash
: > src/features/business/route/http/routes.get.http
cat >> src/features/business/route/http/routes.get.http << 'EOF'
### Feature Route — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllRoute
GET {{baseUrl}}/api/routes

###

# @name getOneRoute
GET {{baseUrl}}/api/routes/{{id}}
EOF
```
```bash
: > src/features/business/route/http/routes.create.http
cat >> src/features/business/route/http/routes.create.http << 'EOF'
### Feature Route — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createRoute
POST {{baseUrl}}/api/routes
Content-Type: application/json

{
  "nombre": "Ejemplo nombre",
  "mensajero_id": 1,
  "zona_cobertura": "Ejemplo zona_cobertura",
  "fecha": "2026-01-15",
  "hora_inicio": "2026-01-15T10:00:00.000Z",
  "hora_fin": "2026-01-15T10:00:00.000Z",
  "estado": "planificada",
  "is_active": true
}
EOF
```
```bash
: > src/features/business/route/http/routes.update.http
cat >> src/features/business/route/http/routes.update.http << 'EOF'
### Feature Route — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updateRoutePut
PUT {{baseUrl}}/api/routes/{{id}}
Content-Type: application/json

{
  "nombre": "Ejemplo nombre",
  "mensajero_id": 1,
  "zona_cobertura": "Ejemplo zona_cobertura",
  "fecha": "2026-01-15",
  "hora_inicio": "2026-01-15T10:00:00.000Z",
  "hora_fin": "2026-01-15T10:00:00.000Z",
  "estado": "planificada",
  "is_active": true
}

###

# @name updateRoutePatch
PATCH {{baseUrl}}/api/routes/{{id}}
Content-Type: application/json

{
  "mensajero_id": 1
}
EOF
```
```bash
: > src/features/business/route/http/routes.delete.http
cat >> src/features/business/route/http/routes.delete.http << 'EOF'
### Feature Route — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteRoutePhysical
DELETE {{baseUrl}}/api/routes/{{id}}

###

# @name deleteRouteLogical
PATCH {{baseUrl}}/api/routes/{{id}}/deactivate
EOF
```

---

## 12.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { RateRoutes } ...`, **añadir**:

```ts
import { RouteRoutes } from "../features/business/route/route.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `rateRoutes`, **añadir**:

```ts
  public routeRoutes: RouteRoutes = new RouteRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/rate/rate.model";`, **añadir**:

```ts
import "../features/business/route/route.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.rateRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.routeRoutes.routes(this.app);
```

---

## 12.5 Relación / asociaciones Route

> `Route` referencia: **Messenger**. Norma FK: `<tabla_singular>_id`.

```bash
: > src/features/business/route/route.associations.ts
cat >> src/features/business/route/route.associations.ts << 'EOF'
import { Route } from "./route.model";
import { Messenger } from "../messenger/messenger.model";

Route.belongsTo(Messenger, { foreignKey: "mensajero_id", as: "messenger" });
Messenger.hasMany(Route, { foreignKey: "mensajero_id", as: "routes" });
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

**Debajo de** `import "../features/business/route/route.model";` (y **encima de** `import { Routes }`), **añadir**:

```ts
import "../features/business/route/route.associations";
```

---

## 12.6 Seeder Route

```bash
: > src/features/business/route/route.seeder.ts
cat >> src/features/business/route/route.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Route } from "./route.model";
import { Messenger } from "../messenger/messenger.model";

/**
 * Seeder del feature Route (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedRoutes(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  routes: count=0, se omite");
    return 0;
  }

  const existing = await Route.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  routes: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const messengerList = await Messenger.findAll({ where: { is_active: true } });
  if (messengerList.length === 0) {
    console.log("\u23ed\ufe0f  routes: faltan dependencias activas (messengerList), se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
      nombre: "Ruta " + faker.location.city(),
      mensajero_id: faker.helpers.arrayElement(messengerList).id,
      zona_cobertura: faker.location.city(),
      fecha: faker.date.soon().toISOString().slice(0, 10),
      hora_inicio: faker.date.soon(),
      hora_fin: faker.date.soon(),
      estado: faker.helpers.arrayElement(["planificada", "en_curso", "finalizada"]),
      is_active: true,
  }));

  await Route.bulkCreate(rows);
  console.log(`\u2705 routes: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```
**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `routes: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `routes: 15,`
- Lectura opcional por env: `SEED_ROUTES`.

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** el import del seeder anterior, **añadir** `import { seedRoutes } from "../../features/business/route/route.seeder";`
2. **Debajo de** `await seedRates(counts.rates);`, **añadir** `await seedRoutes(counts.routes);`

---

## 12.7 Swagger Route

```bash
: > src/features/business/route/route.swagger.ts
cat >> src/features/business/route/route.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature Route.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const routeSwagger = {
  tags: [
    {
      name: "Routes",
      description: "CRUD de routes — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/routes": {
      get: {
        tags: ["Routes"],
        summary: "Listar routes activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de routes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    routes: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Route" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Routes"],
        summary: "Crear route",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RouteCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Route creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    route: { $ref: "#/components/schemas/Route" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/routes/{id}": {
      get: {
        tags: ["Routes"],
        summary: "Obtener route por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Route encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    route: { $ref: "#/components/schemas/Route" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Routes"],
        summary: "Actualizar route (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RouteCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Routes"],
        summary: "Actualizar route (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RoutePatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Routes"],
        summary: "Eliminar route (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/routes/{id}/deactivate": {
      patch: {
        tags: ["Routes"],
        summary: "Eliminar route (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Route: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      nombre: { type: "string", example: "nombre" },
      mensajero_id: { type: "integer", example: 1 },
      zona_cobertura: { type: "string", example: "zona_cobertura" },
      fecha: { type: "string", format: "date", example: "2026-01-15" },
      hora_inicio: { type: "string", format: "date-time" },
      hora_fin: { type: "string", format: "date-time" },
      estado: { type: "string", enum: ["planificada", "en_curso", "finalizada"], example: "planificada" },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      RouteCreate: {
        type: "object",
        required: ["nombre", "mensajero_id", "fecha", "estado"],
        properties: {
      nombre: { type: "string", example: "nombre" },
      mensajero_id: { type: "integer", example: 1 },
      zona_cobertura: { type: "string", example: "zona_cobertura" },
      fecha: { type: "string", format: "date", example: "2026-01-15" },
      hora_inicio: { type: "string", format: "date-time" },
      hora_fin: { type: "string", format: "date-time" },
      estado: { type: "string", enum: ["planificada", "en_curso", "finalizada"], example: "planificada" },
      is_active: { type: "boolean", example: true },
        },
      },
      RoutePatch: {
        type: "object",
        properties: {
      nombre: { type: "string", example: "nombre" },
      mensajero_id: { type: "integer", example: 1 },
      zona_cobertura: { type: "string", example: "zona_cobertura" },
      fecha: { type: "string", format: "date", example: "2026-01-15" },
      hora_inicio: { type: "string", format: "date-time" },
      hora_fin: { type: "string", format: "date-time" },
      estado: { type: "string", enum: ["planificada", "en_curso", "finalizada"], example: "planificada" },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```
**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { rateSwagger } ...`, **añadir** `import { routeSwagger } from "../features/business/route/route.swagger";`
2. **Dentro de** `featureSwaggerModules`, **debajo de** `rateSwagger,`, **añadir** `routeSwagger,`

### Verificación

```bash
curl -s http://localhost:4000/api/routes
```

![alt text](img-express/api_routes.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_routes.png)

![alt text](img-express/docs_routes.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

## 13. ISS-12 — Feature Shipment

**Objetivo:** CRUD completo + seeder + swagger de **Shipment** (tabla `shipments`).  
**Bloqueado por:** ISS-11.  
**API:** `/api/shipments` — **SIN AUTH**.  
**Patrón:** mismo que las features anteriores (modelo → controller/routes → http → cableado → relación → seeder → swagger).

### Criterios de aceptación (ISS-12)

- [X] **13.1** Modelo `shipment.model.ts` (`is_active` boolean + `timestamps: true`, columnas snake_case)
- [X] **13.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [X] **13.3** Carpeta `http/` con get, create, update, delete
- [X] **13.4** Cableado en `routes/index.ts` + `config/index.ts`
- [X] **13.5** Asociaciones (`shipment.associations.ts`) + PARCHE `config`
- [X] **13.6** Seeder + registro en SeedersRunner / `counts.ts`
- [X] **13.7** Swagger + registro en `src/swagger`

> `factura_id` se agrega mas adelante por PARCHE en ISS-17 (Invoice todavia no existe).

---

```bash
mkdir -p \
  src/features/business/shipment/http
```

## 13.1 Modelo Shipment

```bash
: > src/features/business/shipment/shipment.model.ts
cat >> src/features/business/shipment/shipment.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ShipmentI {
  id?: number;
  numero_guia: string;
  empresa_id: number;
  contacto_origen_id: number;
  direccion_origen_id: number;
  contacto_destino_id: number;
  direccion_destino_id: number;
  mensajero_id?: number | null;
  ruta_id?: number | null;
  tarifa_id: number;
  prioridad: "normal" | "urgente" | "express";
  peso_total_kg: number;
  valor_declarado?: number | null;
  costo_calculado?: number | null;
  estado: "creado" | "cotizado" | "asignado" | "en_ruta" | "entregado" | "con_novedad" | "cancelado";
  fecha_solicitud: Date | string;
  fecha_entrega_estimada?: Date | string | null;
  fecha_entrega_real?: Date | string | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Shipment extends Model {
  public id!: number;
  public numero_guia!: string;
  public empresa_id!: number;
  public contacto_origen_id!: number;
  public direccion_origen_id!: number;
  public contacto_destino_id!: number;
  public direccion_destino_id!: number;
  public mensajero_id!: number | null;
  public ruta_id!: number | null;
  public tarifa_id!: number;
  public prioridad!: "normal" | "urgente" | "express";
  public peso_total_kg!: number;
  public valor_declarado!: number | null;
  public costo_calculado!: number | null;
  public estado!: "creado" | "cotizado" | "asignado" | "en_ruta" | "entregado" | "con_novedad" | "cancelado";
  public fecha_solicitud!: Date | string;
  public fecha_entrega_estimada!: Date | string | null;
  public fecha_entrega_real!: Date | string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Shipment.init(
  {
    numero_guia: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      references: { model: "companies", key: "id" },
      allowNull: false,
    },
    contacto_origen_id: {
      type: DataTypes.INTEGER,
      references: { model: "contacts", key: "id" },
      allowNull: false,
    },
    direccion_origen_id: {
      type: DataTypes.INTEGER,
      references: { model: "addresses", key: "id" },
      allowNull: false,
    },
    contacto_destino_id: {
      type: DataTypes.INTEGER,
      references: { model: "contacts", key: "id" },
      allowNull: false,
    },
    direccion_destino_id: {
      type: DataTypes.INTEGER,
      references: { model: "addresses", key: "id" },
      allowNull: false,
    },
    mensajero_id: {
      type: DataTypes.INTEGER,
      references: { model: "messengers", key: "id" },
      allowNull: true,
    },
    ruta_id: {
      type: DataTypes.INTEGER,
      references: { model: "routes", key: "id" },
      allowNull: true,
    },
    tarifa_id: {
      type: DataTypes.INTEGER,
      references: { model: "rates", key: "id" },
      allowNull: false,
    },
    prioridad: {
      type: DataTypes.ENUM("normal", "urgente", "express"),
      allowNull: false,
      defaultValue: "normal",
    },
    peso_total_kg: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    valor_declarado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    costo_calculado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("creado", "cotizado", "asignado", "en_ruta", "entregado", "con_novedad", "cancelado"),
      allowNull: false,
      defaultValue: "creado",
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_entrega_estimada: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fecha_entrega_real: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Shipment",
    tableName: "shipments",
    timestamps: true,
  }
);
EOF
```

---

## 13.2 Controller + routes (CRUD completo)

```bash
: > src/features/business/shipment/shipment.controller.ts
cat >> src/features/business/shipment/shipment.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Shipment, ShipmentI } from "./shipment.model";
import { Company } from "../company/company.model";
import { Contact } from "../contact/contact.model";
import { Address } from "../address/address.model";
import { Rate } from "../rate/rate.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class ShipmentController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const shipments = await Shipment.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ shipments });
    } catch (error) {
      res.status(500).json({ error: "Error fetching shipments", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }
      res.status(200).json({ shipment: shipment });
    } catch (error) {
      res.status(500).json({ error: "Error fetching shipment", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ShipmentI;
      if (body.empresa_id !== undefined && body.empresa_id !== null) {
        const found_empresa_id = await Company.findByPk(body.empresa_id);
        if (!found_empresa_id) {
          res.status(404).json({ error: "Company (empresa_id) not found" });
          return;
        }
      }
      if (body.contacto_origen_id !== undefined && body.contacto_origen_id !== null) {
        const found_contacto_origen_id = await Contact.findByPk(body.contacto_origen_id);
        if (!found_contacto_origen_id) {
          res.status(404).json({ error: "Contact (contacto_origen_id) not found" });
          return;
        }
      }
      if (body.direccion_origen_id !== undefined && body.direccion_origen_id !== null) {
        const found_direccion_origen_id = await Address.findByPk(body.direccion_origen_id);
        if (!found_direccion_origen_id) {
          res.status(404).json({ error: "Address (direccion_origen_id) not found" });
          return;
        }
      }
      if (body.contacto_destino_id !== undefined && body.contacto_destino_id !== null) {
        const found_contacto_destino_id = await Contact.findByPk(body.contacto_destino_id);
        if (!found_contacto_destino_id) {
          res.status(404).json({ error: "Contact (contacto_destino_id) not found" });
          return;
        }
      }
      if (body.direccion_destino_id !== undefined && body.direccion_destino_id !== null) {
        const found_direccion_destino_id = await Address.findByPk(body.direccion_destino_id);
        if (!found_direccion_destino_id) {
          res.status(404).json({ error: "Address (direccion_destino_id) not found" });
          return;
        }
      }
      if (body.tarifa_id !== undefined && body.tarifa_id !== null) {
        const found_tarifa_id = await Rate.findByPk(body.tarifa_id);
        if (!found_tarifa_id) {
          res.status(404).json({ error: "Rate (tarifa_id) not found" });
          return;
        }
      }

      const shipment = await Shipment.create({
        numero_guia: body.numero_guia,
        empresa_id: body.empresa_id,
        contacto_origen_id: body.contacto_origen_id,
        direccion_origen_id: body.direccion_origen_id,
        contacto_destino_id: body.contacto_destino_id,
        direccion_destino_id: body.direccion_destino_id,
        mensajero_id: body.mensajero_id ?? null,
        ruta_id: body.ruta_id ?? null,
        tarifa_id: body.tarifa_id,
        prioridad: body.prioridad,
        peso_total_kg: body.peso_total_kg,
        valor_declarado: body.valor_declarado ?? null,
        costo_calculado: body.costo_calculado ?? null,
        estado: body.estado,
        fecha_solicitud: body.fecha_solicitud,
        fecha_entrega_estimada: body.fecha_entrega_estimada ?? null,
        fecha_entrega_real: body.fecha_entrega_real ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ shipment: shipment });
    } catch (error) {
      res.status(500).json({ error: "Error creating shipment", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ShipmentI;
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }
      if (body.empresa_id !== undefined && body.empresa_id !== null) {
        const found_empresa_id = await Company.findByPk(body.empresa_id);
        if (!found_empresa_id) {
          res.status(404).json({ error: "Company (empresa_id) not found" });
          return;
        }
      }
      if (body.contacto_origen_id !== undefined && body.contacto_origen_id !== null) {
        const found_contacto_origen_id = await Contact.findByPk(body.contacto_origen_id);
        if (!found_contacto_origen_id) {
          res.status(404).json({ error: "Contact (contacto_origen_id) not found" });
          return;
        }
      }
      if (body.direccion_origen_id !== undefined && body.direccion_origen_id !== null) {
        const found_direccion_origen_id = await Address.findByPk(body.direccion_origen_id);
        if (!found_direccion_origen_id) {
          res.status(404).json({ error: "Address (direccion_origen_id) not found" });
          return;
        }
      }
      if (body.contacto_destino_id !== undefined && body.contacto_destino_id !== null) {
        const found_contacto_destino_id = await Contact.findByPk(body.contacto_destino_id);
        if (!found_contacto_destino_id) {
          res.status(404).json({ error: "Contact (contacto_destino_id) not found" });
          return;
        }
      }
      if (body.direccion_destino_id !== undefined && body.direccion_destino_id !== null) {
        const found_direccion_destino_id = await Address.findByPk(body.direccion_destino_id);
        if (!found_direccion_destino_id) {
          res.status(404).json({ error: "Address (direccion_destino_id) not found" });
          return;
        }
      }
      if (body.tarifa_id !== undefined && body.tarifa_id !== null) {
        const found_tarifa_id = await Rate.findByPk(body.tarifa_id);
        if (!found_tarifa_id) {
          res.status(404).json({ error: "Rate (tarifa_id) not found" });
          return;
        }
      }

      await shipment.update({
        numero_guia: body.numero_guia,
        empresa_id: body.empresa_id,
        contacto_origen_id: body.contacto_origen_id,
        direccion_origen_id: body.direccion_origen_id,
        contacto_destino_id: body.contacto_destino_id,
        direccion_destino_id: body.direccion_destino_id,
        mensajero_id: body.mensajero_id ?? shipment.mensajero_id,
        ruta_id: body.ruta_id ?? shipment.ruta_id,
        tarifa_id: body.tarifa_id,
        prioridad: body.prioridad,
        peso_total_kg: body.peso_total_kg,
        valor_declarado: body.valor_declarado ?? shipment.valor_declarado,
        costo_calculado: body.costo_calculado ?? shipment.costo_calculado,
        estado: body.estado,
        fecha_solicitud: body.fecha_solicitud,
        fecha_entrega_estimada: body.fecha_entrega_estimada ?? shipment.fecha_entrega_estimada,
        fecha_entrega_real: body.fecha_entrega_real ?? shipment.fecha_entrega_real,
        is_active: body.is_active ?? shipment.is_active,
      });

      res.status(200).json({ shipment: shipment });
    } catch (error) {
      res.status(500).json({ error: "Error updating shipment (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ShipmentI>;
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }

      await shipment.update(body);
      res.status(200).json({ shipment: shipment });
    } catch (error) {
      res.status(500).json({ error: "Error updating shipment (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }
      await shipment.destroy();
      res.status(200).json({ message: "Shipment permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting shipment", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const shipment = await Shipment.findByPk(id);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }
      await shipment.update({ is_active: false });
      res.status(200).json({
        message: "Shipment deactivated (logical delete)",
        shipment: shipment,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating shipment", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/shipment/shipment.routes.ts
cat >> src/features/business/shipment/shipment.routes.ts << 'EOF'
import { Application } from "express";
import { ShipmentController } from "./shipment.controller";

export class ShipmentRoutes {
  public shipmentController: ShipmentController = new ShipmentController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/shipments")
      .get(this.shipmentController.getAll.bind(this.shipmentController));

    // getOne
    app
      .route("/api/shipments/:id")
      .get(this.shipmentController.getOne.bind(this.shipmentController));

    // create
    app
      .route("/api/shipments")
      .post(this.shipmentController.create.bind(this.shipmentController));

    // update (PUT / PATCH)
    app
      .route("/api/shipments/:id")
      .put(this.shipmentController.updatePut.bind(this.shipmentController))
      .patch(this.shipmentController.updatePatch.bind(this.shipmentController));

    // delete fisico
    app
      .route("/api/shipments/:id")
      .delete(this.shipmentController.deletePhysical.bind(this.shipmentController));

    // delete logico
    app
      .route("/api/shipments/:id/deactivate")
      .patch(this.shipmentController.deleteLogical.bind(this.shipmentController));
  }
}
EOF
```

---

## 13.3 HTTP

```bash
: > src/features/business/shipment/http/shipments.get.http
cat >> src/features/business/shipment/http/shipments.get.http << 'EOF'
### Feature Shipment — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllShipment
GET {{baseUrl}}/api/shipments

###

# @name getOneShipment
GET {{baseUrl}}/api/shipments/{{id}}
EOF
```
```bash
: > src/features/business/shipment/http/shipments.create.http
cat >> src/features/business/shipment/http/shipments.create.http << 'EOF'
### Feature Shipment — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createShipment
POST {{baseUrl}}/api/shipments
Content-Type: application/json

{
  "numero_guia": "Ejemplo numero_guia",
  "empresa_id": 1,
  "contacto_origen_id": 1,
  "direccion_origen_id": 1,
  "contacto_destino_id": 1,
  "direccion_destino_id": 1,
  "mensajero_id": 1,
  "ruta_id": 1,
  "tarifa_id": 1,
  "prioridad": "normal",
  "peso_total_kg": 10.5,
  "valor_declarado": 10.5,
  "costo_calculado": 10.5,
  "estado": "creado",
  "fecha_solicitud": "2026-01-15T10:00:00.000Z",
  "fecha_entrega_estimada": "2026-01-15T10:00:00.000Z",
  "fecha_entrega_real": "2026-01-15T10:00:00.000Z",
  "is_active": true
}
EOF
```
```bash
: > src/features/business/shipment/http/shipments.update.http
cat >> src/features/business/shipment/http/shipments.update.http << 'EOF'
### Feature Shipment — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updateShipmentPut
PUT {{baseUrl}}/api/shipments/{{id}}
Content-Type: application/json

{
  "numero_guia": "Ejemplo numero_guia",
  "empresa_id": 1,
  "contacto_origen_id": 1,
  "direccion_origen_id": 1,
  "contacto_destino_id": 1,
  "direccion_destino_id": 1,
  "mensajero_id": 1,
  "ruta_id": 1,
  "tarifa_id": 1,
  "prioridad": "normal",
  "peso_total_kg": 10.5,
  "valor_declarado": 10.5,
  "costo_calculado": 10.5,
  "estado": "creado",
  "fecha_solicitud": "2026-01-15T10:00:00.000Z",
  "fecha_entrega_estimada": "2026-01-15T10:00:00.000Z",
  "fecha_entrega_real": "2026-01-15T10:00:00.000Z",
  "is_active": true
}

###

# @name updateShipmentPatch
PATCH {{baseUrl}}/api/shipments/{{id}}
Content-Type: application/json

{
  "empresa_id": 1
}
EOF
```
```bash
: > src/features/business/shipment/http/shipments.delete.http
cat >> src/features/business/shipment/http/shipments.delete.http << 'EOF'
### Feature Shipment — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteShipmentPhysical
DELETE {{baseUrl}}/api/shipments/{{id}}

###

# @name deleteShipmentLogical
PATCH {{baseUrl}}/api/shipments/{{id}}/deactivate
EOF
```

---

## 13.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { RouteRoutes } ...`, **añadir**:

```ts
import { ShipmentRoutes } from "../features/business/shipment/shipment.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `routeRoutes`, **añadir**:

```ts
  public shipmentRoutes: ShipmentRoutes = new ShipmentRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/route/route.model";`, **añadir**:

```ts
import "../features/business/shipment/shipment.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.routeRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.shipmentRoutes.routes(this.app);
```

---

## 13.5 Relación / asociaciones Shipment

> `Shipment` referencia: **Address, Company, Contact, Messenger, Rate, Route**. Norma FK: `<tabla_singular>_id`.

```bash
: > src/features/business/shipment/shipment.associations.ts
cat >> src/features/business/shipment/shipment.associations.ts << 'EOF'
import { Shipment } from "./shipment.model";
import { Company } from "../company/company.model";
import { Contact } from "../contact/contact.model";
import { Address } from "../address/address.model";
import { Messenger } from "../messenger/messenger.model";
import { Route } from "../route/route.model";
import { Rate } from "../rate/rate.model";

Shipment.belongsTo(Company, { foreignKey: "empresa_id", as: "company" });
Company.hasMany(Shipment, { foreignKey: "empresa_id", as: "shipments" });
Shipment.belongsTo(Contact, { foreignKey: "contacto_origen_id", as: "contacto_origen" });
Contact.hasMany(Shipment, { foreignKey: "contacto_origen_id", as: "shipments_contacto_origen" });
Shipment.belongsTo(Address, { foreignKey: "direccion_origen_id", as: "direccion_origen" });
Address.hasMany(Shipment, { foreignKey: "direccion_origen_id", as: "shipments_direccion_origen" });
Shipment.belongsTo(Contact, { foreignKey: "contacto_destino_id", as: "contacto_destino" });
Contact.hasMany(Shipment, { foreignKey: "contacto_destino_id", as: "shipments_contacto_destino" });
Shipment.belongsTo(Address, { foreignKey: "direccion_destino_id", as: "direccion_destino" });
Address.hasMany(Shipment, { foreignKey: "direccion_destino_id", as: "shipments_direccion_destino" });
Shipment.belongsTo(Messenger, { foreignKey: "mensajero_id", as: "messenger" });
Messenger.hasMany(Shipment, { foreignKey: "mensajero_id", as: "shipments" });
Shipment.belongsTo(Route, { foreignKey: "ruta_id", as: "route" });
Route.hasMany(Shipment, { foreignKey: "ruta_id", as: "shipments" });
Shipment.belongsTo(Rate, { foreignKey: "tarifa_id", as: "rate" });
Rate.hasMany(Shipment, { foreignKey: "tarifa_id", as: "shipments" });
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

**Debajo de** `import "../features/business/shipment/shipment.model";` (y **encima de** `import { Routes }`), **añadir**:

```ts
import "../features/business/shipment/shipment.associations";
```

---

## 13.6 Seeder Shipment

```bash
: > src/features/business/shipment/shipment.seeder.ts
cat >> src/features/business/shipment/shipment.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Shipment } from "./shipment.model";
import { Company } from "../company/company.model";
import { Contact } from "../contact/contact.model";
import { Address } from "../address/address.model";
import { Messenger } from "../messenger/messenger.model";
import { Route } from "../route/route.model";
import { Rate } from "../rate/rate.model";

/**
 * Seeder del feature Shipment (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedShipments(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  shipments: count=0, se omite");
    return 0;
  }

  const existing = await Shipment.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  shipments: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const companyList = await Company.findAll({ where: { is_active: true } });
  const contactList = await Contact.findAll({ where: { is_active: true } });
  const addressList = await Address.findAll({ where: { is_active: true } });
  const messengerList = await Messenger.findAll({ where: { is_active: true } });
  const routeList = await Route.findAll({ where: { is_active: true } });
  const rateList = await Rate.findAll({ where: { is_active: true } });
  if (companyList.length === 0) {
    console.log("\u23ed\ufe0f  shipments: faltan dependencias activas (companyList), se omite seeder");
    return 0;
  }
  if (contactList.length === 0) {
    console.log("\u23ed\ufe0f  shipments: faltan dependencias activas (contactList), se omite seeder");
    return 0;
  }
  if (addressList.length === 0) {
    console.log("\u23ed\ufe0f  shipments: faltan dependencias activas (addressList), se omite seeder");
    return 0;
  }
  if (rateList.length === 0) {
    console.log("\u23ed\ufe0f  shipments: faltan dependencias activas (rateList), se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
      numero_guia: "EE-" + faker.string.alphanumeric(8).toUpperCase(),
      empresa_id: faker.helpers.arrayElement(companyList).id,
      contacto_origen_id: faker.helpers.arrayElement(contactList).id,
      direccion_origen_id: faker.helpers.arrayElement(addressList).id,
      contacto_destino_id: faker.helpers.arrayElement(contactList).id,
      direccion_destino_id: faker.helpers.arrayElement(addressList).id,
      mensajero_id: messengerList.length ? faker.helpers.arrayElement(messengerList).id : null,
      ruta_id: routeList.length ? faker.helpers.arrayElement(routeList).id : null,
      tarifa_id: faker.helpers.arrayElement(rateList).id,
      prioridad: faker.helpers.arrayElement(["normal", "urgente", "express"]),
      peso_total_kg: Number(faker.commerce.price({ min: 0.5, max: 50, dec: 2 })),
      valor_declarado: Number(faker.commerce.price({ min: 10000, max: 2000000, dec: 2 })),
      costo_calculado: Number(faker.commerce.price({ min: 5000, max: 100000, dec: 2 })),
      estado: faker.helpers.arrayElement(["creado", "cotizado", "asignado", "en_ruta", "entregado", "con_novedad", "cancelado"]),
      fecha_solicitud: faker.date.recent(),
      fecha_entrega_estimada: faker.date.soon(),
      fecha_entrega_real: faker.date.recent(),
      is_active: true,
  }));

  await Shipment.bulkCreate(rows);
  console.log(`\u2705 shipments: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```
**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `shipments: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `shipments: 15,`
- Lectura opcional por env: `SEED_SHIPMENTS`.

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** el import del seeder anterior, **añadir** `import { seedShipments } from "../../features/business/shipment/shipment.seeder";`
2. **Debajo de** `await seedRoutes(counts.routes);`, **añadir** `await seedShipments(counts.shipments);`

---

## 13.7 Swagger Shipment

```bash
: > src/features/business/shipment/shipment.swagger.ts
cat >> src/features/business/shipment/shipment.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature Shipment.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const shipmentSwagger = {
  tags: [
    {
      name: "Shipments",
      description: "CRUD de shipments — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/shipments": {
      get: {
        tags: ["Shipments"],
        summary: "Listar shipments activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de shipments",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    shipments: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Shipment" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Shipments"],
        summary: "Crear shipment",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ShipmentCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Shipment creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    shipment: { $ref: "#/components/schemas/Shipment" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/shipments/{id}": {
      get: {
        tags: ["Shipments"],
        summary: "Obtener shipment por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Shipment encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    shipment: { $ref: "#/components/schemas/Shipment" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Shipments"],
        summary: "Actualizar shipment (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ShipmentCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Shipments"],
        summary: "Actualizar shipment (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ShipmentPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Shipments"],
        summary: "Eliminar shipment (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/shipments/{id}/deactivate": {
      patch: {
        tags: ["Shipments"],
        summary: "Eliminar shipment (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Shipment: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      numero_guia: { type: "string", example: "numero_guia" },
      empresa_id: { type: "integer", example: 1 },
      contacto_origen_id: { type: "integer", example: 1 },
      direccion_origen_id: { type: "integer", example: 1 },
      contacto_destino_id: { type: "integer", example: 1 },
      direccion_destino_id: { type: "integer", example: 1 },
      mensajero_id: { type: "integer", example: 1 },
      ruta_id: { type: "integer", example: 1 },
      tarifa_id: { type: "integer", example: 1 },
      prioridad: { type: "string", enum: ["normal", "urgente", "express"], example: "normal" },
      peso_total_kg: { type: "number", example: 10.5 },
      valor_declarado: { type: "number", example: 10.5 },
      costo_calculado: { type: "number", example: 10.5 },
      estado: { type: "string", enum: ["creado", "cotizado", "asignado", "en_ruta", "entregado", "con_novedad", "cancelado"], example: "creado" },
      fecha_solicitud: { type: "string", format: "date-time" },
      fecha_entrega_estimada: { type: "string", format: "date-time" },
      fecha_entrega_real: { type: "string", format: "date-time" },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      ShipmentCreate: {
        type: "object",
        required: ["numero_guia", "empresa_id", "contacto_origen_id", "direccion_origen_id", "contacto_destino_id", "direccion_destino_id", "tarifa_id", "prioridad", "peso_total_kg", "estado", "fecha_solicitud"],
        properties: {
      numero_guia: { type: "string", example: "numero_guia" },
      empresa_id: { type: "integer", example: 1 },
      contacto_origen_id: { type: "integer", example: 1 },
      direccion_origen_id: { type: "integer", example: 1 },
      contacto_destino_id: { type: "integer", example: 1 },
      direccion_destino_id: { type: "integer", example: 1 },
      mensajero_id: { type: "integer", example: 1 },
      ruta_id: { type: "integer", example: 1 },
      tarifa_id: { type: "integer", example: 1 },
      prioridad: { type: "string", enum: ["normal", "urgente", "express"], example: "normal" },
      peso_total_kg: { type: "number", example: 10.5 },
      valor_declarado: { type: "number", example: 10.5 },
      costo_calculado: { type: "number", example: 10.5 },
      estado: { type: "string", enum: ["creado", "cotizado", "asignado", "en_ruta", "entregado", "con_novedad", "cancelado"], example: "creado" },
      fecha_solicitud: { type: "string", format: "date-time" },
      fecha_entrega_estimada: { type: "string", format: "date-time" },
      fecha_entrega_real: { type: "string", format: "date-time" },
      is_active: { type: "boolean", example: true },
        },
      },
      ShipmentPatch: {
        type: "object",
        properties: {
      numero_guia: { type: "string", example: "numero_guia" },
      empresa_id: { type: "integer", example: 1 },
      contacto_origen_id: { type: "integer", example: 1 },
      direccion_origen_id: { type: "integer", example: 1 },
      contacto_destino_id: { type: "integer", example: 1 },
      direccion_destino_id: { type: "integer", example: 1 },
      mensajero_id: { type: "integer", example: 1 },
      ruta_id: { type: "integer", example: 1 },
      tarifa_id: { type: "integer", example: 1 },
      prioridad: { type: "string", enum: ["normal", "urgente", "express"], example: "normal" },
      peso_total_kg: { type: "number", example: 10.5 },
      valor_declarado: { type: "number", example: 10.5 },
      costo_calculado: { type: "number", example: 10.5 },
      estado: { type: "string", enum: ["creado", "cotizado", "asignado", "en_ruta", "entregado", "con_novedad", "cancelado"], example: "creado" },
      fecha_solicitud: { type: "string", format: "date-time" },
      fecha_entrega_estimada: { type: "string", format: "date-time" },
      fecha_entrega_real: { type: "string", format: "date-time" },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```
**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { routeSwagger } ...`, **añadir** `import { shipmentSwagger } from "../features/business/shipment/shipment.swagger";`
2. **Dentro de** `featureSwaggerModules`, **debajo de** `routeSwagger,`, **añadir** `shipmentSwagger,`

### Verificación

```bash
curl -s http://localhost:4000/api/shipments
```

![alt text](img-express/api_shipment.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_shipment.png)

![alt text](img-express/docs_shipment.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

## 14. ISS-13 — Feature Package

**Objetivo:** CRUD completo + seeder + swagger de **Package** (tabla `packages`).  
**Bloqueado por:** ISS-12.  
**API:** `/api/packages` — **SIN AUTH**.  
**Patrón:** mismo que las features anteriores (modelo → controller/routes → http → cableado → relación → seeder → swagger).

### Criterios de aceptación (ISS-13)

- [X] **14.1** Modelo `package.model.ts` (`is_active` boolean + `timestamps: true`, columnas snake_case)
- [X] **14.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [X] **14.3** Carpeta `http/` con get, create, update, delete
- [X] **14.4** Cableado en `routes/index.ts` + `config/index.ts`
- [X] **14.5** Asociaciones (`package.associations.ts`) + PARCHE `config`
- [X] **14.6** Seeder + registro en SeedersRunner / `counts.ts`
- [X] **14.7** Swagger + registro en `src/swagger`

---

```bash
mkdir -p \
  src/features/business/package/http
```

## 14.1 Modelo Package

```bash
: > src/features/business/package/package.model.ts
cat >> src/features/business/package/package.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface PackageI {
  id?: number;
  envio_id: number;
  descripcion_contenido?: string | null;
  peso_kg: number;
  alto_cm?: number | null;
  ancho_cm?: number | null;
  largo_cm?: number | null;
  valor_declarado?: number | null;
  es_fragil?: boolean;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Package extends Model {
  public id!: number;
  public envio_id!: number;
  public descripcion_contenido!: string | null;
  public peso_kg!: number;
  public alto_cm!: number | null;
  public ancho_cm!: number | null;
  public largo_cm!: number | null;
  public valor_declarado!: number | null;
  public es_fragil!: boolean;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Package.init(
  {
    envio_id: {
      type: DataTypes.INTEGER,
      references: { model: "shipments", key: "id" },
      allowNull: false,
    },
    descripcion_contenido: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    peso_kg: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    alto_cm: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    ancho_cm: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    largo_cm: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    valor_declarado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    es_fragil: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Package",
    tableName: "packages",
    timestamps: true,
  }
);
EOF
```

---

## 14.2 Controller + routes (CRUD completo)

```bash
: > src/features/business/package/package.controller.ts
cat >> src/features/business/package/package.controller.ts << 'EOF'
import { Request, Response } from "express";
import { Package, PackageI } from "./package.model";
import { Shipment } from "../shipment/shipment.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class PackageController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const packages = await Package.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ packages });
    } catch (error) {
      res.status(500).json({ error: "Error fetching packages", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      res.status(200).json({ package: pkg });
    } catch (error) {
      res.status(500).json({ error: "Error fetching package", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PackageI;
      if (body.envio_id !== undefined && body.envio_id !== null) {
        const found_envio_id = await Shipment.findByPk(body.envio_id);
        if (!found_envio_id) {
          res.status(404).json({ error: "Shipment (envio_id) not found" });
          return;
        }
      }

      const pkg = await Package.create({
        envio_id: body.envio_id,
        descripcion_contenido: body.descripcion_contenido ?? null,
        peso_kg: body.peso_kg,
        alto_cm: body.alto_cm ?? null,
        ancho_cm: body.ancho_cm ?? null,
        largo_cm: body.largo_cm ?? null,
        valor_declarado: body.valor_declarado ?? null,
        es_fragil: body.es_fragil ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ package: pkg });
    } catch (error) {
      res.status(500).json({ error: "Error creating package", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PackageI;
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      if (body.envio_id !== undefined && body.envio_id !== null) {
        const found_envio_id = await Shipment.findByPk(body.envio_id);
        if (!found_envio_id) {
          res.status(404).json({ error: "Shipment (envio_id) not found" });
          return;
        }
      }

      await pkg.update({
        envio_id: body.envio_id,
        descripcion_contenido: body.descripcion_contenido ?? pkg.descripcion_contenido,
        peso_kg: body.peso_kg,
        alto_cm: body.alto_cm ?? pkg.alto_cm,
        ancho_cm: body.ancho_cm ?? pkg.ancho_cm,
        largo_cm: body.largo_cm ?? pkg.largo_cm,
        valor_declarado: body.valor_declarado ?? pkg.valor_declarado,
        es_fragil: body.es_fragil ?? pkg.es_fragil,
        is_active: body.is_active ?? pkg.is_active,
      });

      res.status(200).json({ package: pkg });
    } catch (error) {
      res.status(500).json({ error: "Error updating package (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PackageI>;
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }

      await pkg.update(body);
      res.status(200).json({ package: pkg });
    } catch (error) {
      res.status(500).json({ error: "Error updating package (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      await pkg.destroy();
      res.status(200).json({ message: "Package permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting package", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pkg = await Package.findByPk(id);
      if (!pkg) {
        res.status(404).json({ error: "Package not found" });
        return;
      }
      await pkg.update({ is_active: false });
      res.status(200).json({
        message: "Package deactivated (logical delete)",
        package: pkg,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating package", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/package/package.routes.ts
cat >> src/features/business/package/package.routes.ts << 'EOF'
import { Application } from "express";
import { PackageController } from "./package.controller";

export class PackageRoutes {
  public packageController: PackageController = new PackageController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/packages")
      .get(this.packageController.getAll.bind(this.packageController));

    // getOne
    app
      .route("/api/packages/:id")
      .get(this.packageController.getOne.bind(this.packageController));

    // create
    app
      .route("/api/packages")
      .post(this.packageController.create.bind(this.packageController));

    // update (PUT / PATCH)
    app
      .route("/api/packages/:id")
      .put(this.packageController.updatePut.bind(this.packageController))
      .patch(this.packageController.updatePatch.bind(this.packageController));

    // delete fisico
    app
      .route("/api/packages/:id")
      .delete(this.packageController.deletePhysical.bind(this.packageController));

    // delete logico
    app
      .route("/api/packages/:id/deactivate")
      .patch(this.packageController.deleteLogical.bind(this.packageController));
  }
}
EOF
```

---

## 14.3 HTTP

```bash
: > src/features/business/package/http/packages.get.http
cat >> src/features/business/package/http/packages.get.http << 'EOF'
### Feature Package — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllPackage
GET {{baseUrl}}/api/packages

###

# @name getOnePackage
GET {{baseUrl}}/api/packages/{{id}}
EOF
```
```bash
: > src/features/business/package/http/packages.create.http
cat >> src/features/business/package/http/packages.create.http << 'EOF'
### Feature Package — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createPackage
POST {{baseUrl}}/api/packages
Content-Type: application/json

{
  "envio_id": 1,
  "descripcion_contenido": "Ejemplo descripcion_contenido",
  "peso_kg": 10.5,
  "alto_cm": 10.5,
  "ancho_cm": 10.5,
  "largo_cm": 10.5,
  "valor_declarado": 10.5,
  "es_fragil": true,
  "is_active": true
}
EOF
```
```bash
: > src/features/business/package/http/packages.update.http
cat >> src/features/business/package/http/packages.update.http << 'EOF'
### Feature Package — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updatePackagePut
PUT {{baseUrl}}/api/packages/{{id}}
Content-Type: application/json

{
  "envio_id": 1,
  "descripcion_contenido": "Ejemplo descripcion_contenido",
  "peso_kg": 10.5,
  "alto_cm": 10.5,
  "ancho_cm": 10.5,
  "largo_cm": 10.5,
  "valor_declarado": 10.5,
  "es_fragil": true,
  "is_active": true
}

###

# @name updatePackagePatch
PATCH {{baseUrl}}/api/packages/{{id}}
Content-Type: application/json

{
  "descripcion_contenido": "Ejemplo descripcion_contenido"
}
EOF
```
```bash
: > src/features/business/package/http/packages.delete.http
cat >> src/features/business/package/http/packages.delete.http << 'EOF'
### Feature Package — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deletePackagePhysical
DELETE {{baseUrl}}/api/packages/{{id}}

###

# @name deletePackageLogical
PATCH {{baseUrl}}/api/packages/{{id}}/deactivate
EOF
```

---

## 14.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { ShipmentRoutes } ...`, **añadir**:

```ts
import { PackageRoutes } from "../features/business/package/package.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `shipmentRoutes`, **añadir**:

```ts
  public packageRoutes: PackageRoutes = new PackageRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/shipment/shipment.model";`, **añadir**:

```ts
import "../features/business/package/package.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.shipmentRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.packageRoutes.routes(this.app);
```

---

## 14.5 Relación / asociaciones Package

> `Package` referencia: **Shipment**. Norma FK: `<tabla_singular>_id`.

```bash
: > src/features/business/package/package.associations.ts
cat >> src/features/business/package/package.associations.ts << 'EOF'
import { Package } from "./package.model";
import { Shipment } from "../shipment/shipment.model";

Package.belongsTo(Shipment, { foreignKey: "envio_id", as: "shipment" });
Shipment.hasMany(Package, { foreignKey: "envio_id", as: "packages" });
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

**Debajo de** `import "../features/business/package/package.model";` (y **encima de** `import { Routes }`), **añadir**:

```ts
import "../features/business/package/package.associations";
```

---

## 14.6 Seeder Package

```bash
: > src/features/business/package/package.seeder.ts
cat >> src/features/business/package/package.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { Package } from "./package.model";
import { Shipment } from "../shipment/shipment.model";

/**
 * Seeder del feature Package (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedPackages(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  packages: count=0, se omite");
    return 0;
  }

  const existing = await Package.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  packages: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const shipmentList = await Shipment.findAll({ where: { is_active: true } });
  if (shipmentList.length === 0) {
    console.log("\u23ed\ufe0f  packages: faltan dependencias activas (shipmentList), se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
      envio_id: faker.helpers.arrayElement(shipmentList).id,
      descripcion_contenido: faker.commerce.productDescription(),
      peso_kg: Number(faker.commerce.price({ min: 0.2, max: 20, dec: 2 })),
      alto_cm: Number(faker.commerce.price({ min: 5, max: 80, dec: 1 })),
      ancho_cm: Number(faker.commerce.price({ min: 5, max: 80, dec: 1 })),
      largo_cm: Number(faker.commerce.price({ min: 5, max: 80, dec: 1 })),
      valor_declarado: Number(faker.commerce.price({ min: 5000, max: 500000, dec: 2 })),
      es_fragil: faker.datatype.boolean(),
      is_active: true,
  }));

  await Package.bulkCreate(rows);
  console.log(`\u2705 packages: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```
**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `packages: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `packages: 15,`
- Lectura opcional por env: `SEED_PACKAGES`.

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** el import del seeder anterior, **añadir** `import { seedPackages } from "../../features/business/package/package.seeder";`
2. **Debajo de** `await seedShipments(counts.shipments);`, **añadir** `await seedPackages(counts.packages);`

---

## 14.7 Swagger Package

```bash
: > src/features/business/package/package.swagger.ts
cat >> src/features/business/package/package.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature Package.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const packageSwagger = {
  tags: [
    {
      name: "Packages",
      description: "CRUD de packages — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/packages": {
      get: {
        tags: ["Packages"],
        summary: "Listar packages activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de packages",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    packages: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Package" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Packages"],
        summary: "Crear package",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PackageCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Package creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    package: { $ref: "#/components/schemas/Package" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/packages/{id}": {
      get: {
        tags: ["Packages"],
        summary: "Obtener package por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Package encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    package: { $ref: "#/components/schemas/Package" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Packages"],
        summary: "Actualizar package (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PackageCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Packages"],
        summary: "Actualizar package (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PackagePatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Packages"],
        summary: "Eliminar package (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/packages/{id}/deactivate": {
      patch: {
        tags: ["Packages"],
        summary: "Eliminar package (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Package: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      envio_id: { type: "integer", example: 1 },
      descripcion_contenido: { type: "string" },
      peso_kg: { type: "number", example: 10.5 },
      alto_cm: { type: "number", example: 10.5 },
      ancho_cm: { type: "number", example: 10.5 },
      largo_cm: { type: "number", example: 10.5 },
      valor_declarado: { type: "number", example: 10.5 },
      es_fragil: { type: "boolean", example: true },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      PackageCreate: {
        type: "object",
        required: ["envio_id", "peso_kg"],
        properties: {
      envio_id: { type: "integer", example: 1 },
      descripcion_contenido: { type: "string" },
      peso_kg: { type: "number", example: 10.5 },
      alto_cm: { type: "number", example: 10.5 },
      ancho_cm: { type: "number", example: 10.5 },
      largo_cm: { type: "number", example: 10.5 },
      valor_declarado: { type: "number", example: 10.5 },
      es_fragil: { type: "boolean", example: true },
      is_active: { type: "boolean", example: true },
        },
      },
      PackagePatch: {
        type: "object",
        properties: {
      envio_id: { type: "integer", example: 1 },
      descripcion_contenido: { type: "string" },
      peso_kg: { type: "number", example: 10.5 },
      alto_cm: { type: "number", example: 10.5 },
      ancho_cm: { type: "number", example: 10.5 },
      largo_cm: { type: "number", example: 10.5 },
      valor_declarado: { type: "number", example: 10.5 },
      es_fragil: { type: "boolean", example: true },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```

**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { shipmentSwagger } ...`, **añadir** `import { packageSwagger } from "../features/business/package/package.swagger";`
2. **Dentro de** `featureSwaggerModules`, **debajo de** `shipmentSwagger,`, **añadir** `packageSwagger,`

### Verificación

```bash
curl -s http://localhost:4000/api/packages
```

![alt text](img-express/api_packages.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_packages.png)

![alt text](img-express/docs_packages.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

## 15. ISS-14 — Feature TrackingEvent

**Objetivo:** CRUD completo + seeder + swagger de **TrackingEvent** (tabla `tracking_events`).  
**Bloqueado por:** ISS-13.  
**API:** `/api/tracking_events` — **SIN AUTH**.  
**Patrón:** mismo que las features anteriores (modelo → controller/routes → http → cableado → relación → seeder → swagger).

### Criterios de aceptación (ISS-14)

- [X] **15.1** Modelo `tracking-event.model.ts` (`is_active` boolean + `timestamps: true`, columnas snake_case)
- [X] **15.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [X] **15.3** Carpeta `http/` con get, create, update, delete
- [X] **15.4** Cableado en `routes/index.ts` + `config/index.ts`
- [X] **15.5** Asociaciones (`tracking-event.associations.ts`) + PARCHE `config`
- [X] **15.6** Seeder + registro en SeedersRunner / `counts.ts`
- [X] **15.7** Swagger + registro en `src/swagger`

---

```bash
mkdir -p \
  src/features/business/tracking-event/http
```

## 15.1 Modelo TrackingEvent

```bash
: > src/features/business/tracking-event/tracking-event.model.ts
cat >> src/features/business/tracking-event/tracking-event.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface TrackingEventI {
  id?: number;
  envio_id: number;
  tipo: "recogido" | "en_transito" | "en_reparto" | "novedad" | "entregado" | "devuelto";
  fecha: Date | string;
  ubicacion?: string | null;
  observaciones?: string | null;
  estado: "informativo" | "novedad_leve" | "novedad_critica";
  registrado_por_id?: number | null;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TrackingEvent extends Model {
  public id!: number;
  public envio_id!: number;
  public tipo!: "recogido" | "en_transito" | "en_reparto" | "novedad" | "entregado" | "devuelto";
  public fecha!: Date | string;
  public ubicacion!: string | null;
  public observaciones!: string | null;
  public estado!: "informativo" | "novedad_leve" | "novedad_critica";
  public registrado_por_id!: number | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TrackingEvent.init(
  {
    envio_id: {
      type: DataTypes.INTEGER,
      references: { model: "shipments", key: "id" },
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("recogido", "en_transito", "en_reparto", "novedad", "entregado", "devuelto"),
      allowNull: false,
      defaultValue: "recogido",
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("informativo", "novedad_leve", "novedad_critica"),
      allowNull: false,
      defaultValue: "informativo",
    },
    registrado_por_id: {
      type: DataTypes.INTEGER,
      references: { model: "messengers", key: "id" },
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "TrackingEvent",
    tableName: "tracking_events",
    timestamps: true,
  }
);
EOF
```

---

## 15.2 Controller + routes (CRUD completo)

```bash
: > src/features/business/tracking-event/tracking-event.controller.ts
cat >> src/features/business/tracking-event/tracking-event.controller.ts << 'EOF'
import { Request, Response } from "express";
import { TrackingEvent, TrackingEventI } from "./tracking-event.model";
import { Shipment } from "../shipment/shipment.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class TrackingEventController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const tracking_events = await TrackingEvent.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ tracking_events });
    } catch (error) {
      res.status(500).json({ error: "Error fetching tracking_events", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }
      res.status(200).json({ trackingEvent: trackingEvent });
    } catch (error) {
      res.status(500).json({ error: "Error fetching trackingEvent", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as TrackingEventI;
      if (body.envio_id !== undefined && body.envio_id !== null) {
        const found_envio_id = await Shipment.findByPk(body.envio_id);
        if (!found_envio_id) {
          res.status(404).json({ error: "Shipment (envio_id) not found" });
          return;
        }
      }

      const trackingEvent = await TrackingEvent.create({
        envio_id: body.envio_id,
        tipo: body.tipo,
        fecha: body.fecha,
        ubicacion: body.ubicacion ?? null,
        observaciones: body.observaciones ?? null,
        estado: body.estado,
        registrado_por_id: body.registrado_por_id ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ trackingEvent: trackingEvent });
    } catch (error) {
      res.status(500).json({ error: "Error creating trackingEvent", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as TrackingEventI;
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }
      if (body.envio_id !== undefined && body.envio_id !== null) {
        const found_envio_id = await Shipment.findByPk(body.envio_id);
        if (!found_envio_id) {
          res.status(404).json({ error: "Shipment (envio_id) not found" });
          return;
        }
      }

      await trackingEvent.update({
        envio_id: body.envio_id,
        tipo: body.tipo,
        fecha: body.fecha,
        ubicacion: body.ubicacion ?? trackingEvent.ubicacion,
        observaciones: body.observaciones ?? trackingEvent.observaciones,
        estado: body.estado,
        registrado_por_id: body.registrado_por_id ?? trackingEvent.registrado_por_id,
        is_active: body.is_active ?? trackingEvent.is_active,
      });

      res.status(200).json({ trackingEvent: trackingEvent });
    } catch (error) {
      res.status(500).json({ error: "Error updating trackingEvent (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<TrackingEventI>;
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }

      await trackingEvent.update(body);
      res.status(200).json({ trackingEvent: trackingEvent });
    } catch (error) {
      res.status(500).json({ error: "Error updating trackingEvent (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }
      await trackingEvent.destroy();
      res.status(200).json({ message: "TrackingEvent permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting trackingEvent", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const trackingEvent = await TrackingEvent.findByPk(id);
      if (!trackingEvent) {
        res.status(404).json({ error: "TrackingEvent not found" });
        return;
      }
      await trackingEvent.update({ is_active: false });
      res.status(200).json({
        message: "TrackingEvent deactivated (logical delete)",
        trackingEvent: trackingEvent,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating trackingEvent", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/tracking-event/tracking-event.routes.ts
cat >> src/features/business/tracking-event/tracking-event.routes.ts << 'EOF'
import { Application } from "express";
import { TrackingEventController } from "./tracking-event.controller";

export class TrackingEventRoutes {
  public trackingEventController: TrackingEventController = new TrackingEventController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/tracking_events")
      .get(this.trackingEventController.getAll.bind(this.trackingEventController));

    // getOne
    app
      .route("/api/tracking_events/:id")
      .get(this.trackingEventController.getOne.bind(this.trackingEventController));

    // create
    app
      .route("/api/tracking_events")
      .post(this.trackingEventController.create.bind(this.trackingEventController));

    // update (PUT / PATCH)
    app
      .route("/api/tracking_events/:id")
      .put(this.trackingEventController.updatePut.bind(this.trackingEventController))
      .patch(this.trackingEventController.updatePatch.bind(this.trackingEventController));

    // delete fisico
    app
      .route("/api/tracking_events/:id")
      .delete(this.trackingEventController.deletePhysical.bind(this.trackingEventController));

    // delete logico
    app
      .route("/api/tracking_events/:id/deactivate")
      .patch(this.trackingEventController.deleteLogical.bind(this.trackingEventController));
  }
}
EOF
```

---

## 15.3 HTTP

```bash
: > src/features/business/tracking-event/http/tracking_events.get.http
cat >> src/features/business/tracking-event/http/tracking_events.get.http << 'EOF'
### Feature TrackingEvent — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllTrackingEvent
GET {{baseUrl}}/api/tracking_events

###

# @name getOneTrackingEvent
GET {{baseUrl}}/api/tracking_events/{{id}}
EOF
```
```bash
: > src/features/business/tracking-event/http/tracking_events.create.http
cat >> src/features/business/tracking-event/http/tracking_events.create.http << 'EOF'
### Feature TrackingEvent — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createTrackingEvent
POST {{baseUrl}}/api/tracking_events
Content-Type: application/json

{
  "envio_id": 1,
  "tipo": "recogido",
  "fecha": "2026-01-15T10:00:00.000Z",
  "ubicacion": "Ejemplo ubicacion",
  "observaciones": "Ejemplo observaciones",
  "estado": "informativo",
  "registrado_por_id": 1,
  "is_active": true
}
EOF
```
```bash
: > src/features/business/tracking-event/http/tracking_events.update.http
cat >> src/features/business/tracking-event/http/tracking_events.update.http << 'EOF'
### Feature TrackingEvent — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updateTrackingEventPut
PUT {{baseUrl}}/api/tracking_events/{{id}}
Content-Type: application/json

{
  "envio_id": 1,
  "tipo": "recogido",
  "fecha": "2026-01-15T10:00:00.000Z",
  "ubicacion": "Ejemplo ubicacion",
  "observaciones": "Ejemplo observaciones",
  "estado": "informativo",
  "registrado_por_id": 1,
  "is_active": true
}

###

# @name updateTrackingEventPatch
PATCH {{baseUrl}}/api/tracking_events/{{id}}
Content-Type: application/json

{
  "tipo": "recogido"
}
EOF
```
```bash
: > src/features/business/tracking-event/http/tracking_events.delete.http
cat >> src/features/business/tracking-event/http/tracking_events.delete.http << 'EOF'
### Feature TrackingEvent — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteTrackingEventPhysical
DELETE {{baseUrl}}/api/tracking_events/{{id}}

###

# @name deleteTrackingEventLogical
PATCH {{baseUrl}}/api/tracking_events/{{id}}/deactivate
EOF
```

---

## 15.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { PackageRoutes } ...`, **añadir**:

```ts
import { TrackingEventRoutes } from "../features/business/tracking-event/tracking-event.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `packageRoutes`, **añadir**:

```ts
  public trackingEventRoutes: TrackingEventRoutes = new TrackingEventRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/package/package.model";`, **añadir**:

```ts
import "../features/business/tracking-event/tracking-event.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.packageRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.trackingEventRoutes.routes(this.app);
```

---

## 15.5 Relación / asociaciones TrackingEvent

> `TrackingEvent` referencia: **Messenger, Shipment**. Norma FK: `<tabla_singular>_id`.

```bash
: > src/features/business/tracking-event/tracking-event.associations.ts
cat >> src/features/business/tracking-event/tracking-event.associations.ts << 'EOF'
import { TrackingEvent } from "./tracking-event.model";
import { Shipment } from "../shipment/shipment.model";
import { Messenger } from "../messenger/messenger.model";

TrackingEvent.belongsTo(Shipment, { foreignKey: "envio_id", as: "shipment" });
Shipment.hasMany(TrackingEvent, { foreignKey: "envio_id", as: "trackingEvents" });
TrackingEvent.belongsTo(Messenger, { foreignKey: "registrado_por_id", as: "registrado_por" });
Messenger.hasMany(TrackingEvent, { foreignKey: "registrado_por_id", as: "trackingEvents_registrado_por" });
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

**Debajo de** `import "../features/business/tracking-event/tracking-event.model";` (y **encima de** `import { Routes }`), **añadir**:

```ts
import "../features/business/tracking-event/tracking-event.associations";
```

---

## 15.6 Seeder TrackingEvent

```bash
: > src/features/business/tracking-event/tracking-event.seeder.ts
cat >> src/features/business/tracking-event/tracking-event.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { TrackingEvent } from "./tracking-event.model";
import { Shipment } from "../shipment/shipment.model";
import { Messenger } from "../messenger/messenger.model";

/**
 * Seeder del feature TrackingEvent (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedTrackingEvents(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  tracking_events: count=0, se omite");
    return 0;
  }

  const existing = await TrackingEvent.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  tracking_events: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const shipmentList = await Shipment.findAll({ where: { is_active: true } });
  const messengerList = await Messenger.findAll({ where: { is_active: true } });
  if (shipmentList.length === 0) {
    console.log("\u23ed\ufe0f  tracking_events: faltan dependencias activas (shipmentList), se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
      envio_id: faker.helpers.arrayElement(shipmentList).id,
      tipo: faker.helpers.arrayElement(["recogido", "en_transito", "en_reparto", "novedad", "entregado", "devuelto"]),
      fecha: faker.date.recent(),
      ubicacion: faker.location.city() + ", " + faker.location.streetAddress(),
      observaciones: faker.lorem.sentence(),
      estado: faker.helpers.arrayElement(["informativo", "novedad_leve", "novedad_critica"]),
      registrado_por_id: messengerList.length ? faker.helpers.arrayElement(messengerList).id : null,
      is_active: true,
  }));

  await TrackingEvent.bulkCreate(rows);
  console.log(`\u2705 tracking_events: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```
**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `tracking_events: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `tracking_events: 15,`
- Lectura opcional por env: `SEED_TRACKING_EVENTS`.

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** el import del seeder anterior, **añadir** `import { seedTrackingEvents } from "../../features/business/tracking-event/tracking-event.seeder";`
2. **Debajo de** `await seedPackages(counts.packages);`, **añadir** `await seedTrackingEvents(counts.tracking_events);`

---

## 15.7 Swagger TrackingEvent

```bash
: > src/features/business/tracking-event/tracking-event.swagger.ts
cat >> src/features/business/tracking-event/tracking-event.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature TrackingEvent.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const trackingEventSwagger = {
  tags: [
    {
      name: "TrackingEvents",
      description: "CRUD de tracking_events — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/tracking_events": {
      get: {
        tags: ["TrackingEvents"],
        summary: "Listar tracking_events activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de tracking_events",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tracking_events: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TrackingEvent" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["TrackingEvents"],
        summary: "Crear trackingEvent",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TrackingEventCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "TrackingEvent creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    trackingEvent: { $ref: "#/components/schemas/TrackingEvent" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/tracking_events/{id}": {
      get: {
        tags: ["TrackingEvents"],
        summary: "Obtener trackingEvent por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "TrackingEvent encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    trackingEvent: { $ref: "#/components/schemas/TrackingEvent" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["TrackingEvents"],
        summary: "Actualizar trackingEvent (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TrackingEventCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["TrackingEvents"],
        summary: "Actualizar trackingEvent (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TrackingEventPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["TrackingEvents"],
        summary: "Eliminar trackingEvent (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/tracking_events/{id}/deactivate": {
      patch: {
        tags: ["TrackingEvents"],
        summary: "Eliminar trackingEvent (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      TrackingEvent: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      envio_id: { type: "integer", example: 1 },
      tipo: { type: "string", enum: ["recogido", "en_transito", "en_reparto", "novedad", "entregado", "devuelto"], example: "recogido" },
      fecha: { type: "string", format: "date-time" },
      ubicacion: { type: "string", example: "ubicacion" },
      observaciones: { type: "string" },
      estado: { type: "string", enum: ["informativo", "novedad_leve", "novedad_critica"], example: "informativo" },
      registrado_por_id: { type: "integer", example: 1 },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      TrackingEventCreate: {
        type: "object",
        required: ["envio_id", "tipo", "fecha", "estado"],
        properties: {
      envio_id: { type: "integer", example: 1 },
      tipo: { type: "string", enum: ["recogido", "en_transito", "en_reparto", "novedad", "entregado", "devuelto"], example: "recogido" },
      fecha: { type: "string", format: "date-time" },
      ubicacion: { type: "string", example: "ubicacion" },
      observaciones: { type: "string" },
      estado: { type: "string", enum: ["informativo", "novedad_leve", "novedad_critica"], example: "informativo" },
      registrado_por_id: { type: "integer", example: 1 },
      is_active: { type: "boolean", example: true },
        },
      },
      TrackingEventPatch: {
        type: "object",
        properties: {
      envio_id: { type: "integer", example: 1 },
      tipo: { type: "string", enum: ["recogido", "en_transito", "en_reparto", "novedad", "entregado", "devuelto"], example: "recogido" },
      fecha: { type: "string", format: "date-time" },
      ubicacion: { type: "string", example: "ubicacion" },
      observaciones: { type: "string" },
      estado: { type: "string", enum: ["informativo", "novedad_leve", "novedad_critica"], example: "informativo" },
      registrado_por_id: { type: "integer", example: 1 },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```
**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { packageSwagger } ...`, **añadir** `import { trackingEventSwagger } from "../features/business/tracking-event/tracking-event.swagger";`
2. **Dentro de** `featureSwaggerModules`, **debajo de** `packageSwagger,`, **añadir** `trackingEventSwagger,`

### Verificación

```bash
curl -s http://localhost:4000/api/tracking_events
```

![alt text](img-express/api_tr_event.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_tr_event.png)

![alt text](img-express/docs_tr_event.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.

---

## 16. ISS-15 — Feature DeliveryProof

**Objetivo:** CRUD completo + seeder + swagger de **DeliveryProof** (tabla `delivery_proofs`).  
**Bloqueado por:** ISS-14.  
**API:** `/api/delivery_proofs` — **SIN AUTH**.  
**Patrón:** mismo que las features anteriores (modelo → controller/routes → http → cableado → relación → seeder → swagger).

### Criterios de aceptación (ISS-15)

- [ ] **16.1** Modelo `delivery-proof.model.ts` (`is_active` boolean + `timestamps: true`, columnas snake_case)
- [ ] **16.2** Controller + routes: getAll, getOne, create, update PUT/PATCH, delete físico y lógico
- [ ] **16.3** Carpeta `http/` con get, create, update, delete
- [ ] **16.4** Cableado en `routes/index.ts` + `config/index.ts`
- [ ] **16.5** Asociaciones (`delivery-proof.associations.ts`) + PARCHE `config`
- [ ] **16.6** Seeder + registro en SeedersRunner / `counts.ts`
- [ ] **16.7** Swagger + registro en `src/swagger`

> Relacion 1:1: `envio_id` es `unique` en `delivery_proofs` (0..1 por shipment).

---

```bash
mkdir -p \
  src/features/business/delivery-proof/http
```

## 16.1 Modelo DeliveryProof

```bash
: > src/features/business/delivery-proof/delivery-proof.model.ts
cat >> src/features/business/delivery-proof/delivery-proof.model.ts << 'EOF'
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface DeliveryProofI {
  id?: number;
  envio_id: number;
  fecha_hora: Date | string;
  receptor_nombre: string;
  receptor_documento?: string | null;
  firma_url?: string | null;
  foto_url?: string | null;
  geolocalizacion_lat?: number | null;
  geolocalizacion_lng?: number | null;
  observaciones?: string | null;
  estado: "valida" | "observada" | "rechazada";
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DeliveryProof extends Model {
  public id!: number;
  public envio_id!: number;
  public fecha_hora!: Date | string;
  public receptor_nombre!: string;
  public receptor_documento!: string | null;
  public firma_url!: string | null;
  public foto_url!: string | null;
  public geolocalizacion_lat!: number | null;
  public geolocalizacion_lng!: number | null;
  public observaciones!: string | null;
  public estado!: "valida" | "observada" | "rechazada";
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DeliveryProof.init(
  {
    envio_id: {
      type: DataTypes.INTEGER,
      references: { model: "shipments", key: "id" },
      allowNull: false,
      unique: true,
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    receptor_nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receptor_documento: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firma_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    foto_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    geolocalizacion_lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    geolocalizacion_lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM("valida", "observada", "rechazada"),
      allowNull: false,
      defaultValue: "valida",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "DeliveryProof",
    tableName: "delivery_proofs",
    timestamps: true,
  }
);
EOF
```

---

## 16.2 Controller + routes (CRUD completo)

```bash
: > src/features/business/delivery-proof/delivery-proof.controller.ts
cat >> src/features/business/delivery-proof/delivery-proof.controller.ts << 'EOF'
import { Request, Response } from "express";
import { DeliveryProof, DeliveryProofI } from "./delivery-proof.model";
import { Shipment } from "../shipment/shipment.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class DeliveryProofController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const delivery_proofs = await DeliveryProof.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ delivery_proofs });
    } catch (error) {
      res.status(500).json({ error: "Error fetching delivery_proofs", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }
      res.status(200).json({ deliveryProof: deliveryProof });
    } catch (error) {
      res.status(500).json({ error: "Error fetching deliveryProof", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as DeliveryProofI;
      if (body.envio_id !== undefined && body.envio_id !== null) {
        const found_envio_id = await Shipment.findByPk(body.envio_id);
        if (!found_envio_id) {
          res.status(404).json({ error: "Shipment (envio_id) not found" });
          return;
        }
      }

      const deliveryProof = await DeliveryProof.create({
        envio_id: body.envio_id,
        fecha_hora: body.fecha_hora,
        receptor_nombre: body.receptor_nombre,
        receptor_documento: body.receptor_documento ?? null,
        firma_url: body.firma_url ?? null,
        foto_url: body.foto_url ?? null,
        geolocalizacion_lat: body.geolocalizacion_lat ?? null,
        geolocalizacion_lng: body.geolocalizacion_lng ?? null,
        observaciones: body.observaciones ?? null,
        estado: body.estado,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ deliveryProof: deliveryProof });
    } catch (error) {
      res.status(500).json({ error: "Error creating deliveryProof", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as DeliveryProofI;
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }
      if (body.envio_id !== undefined && body.envio_id !== null) {
        const found_envio_id = await Shipment.findByPk(body.envio_id);
        if (!found_envio_id) {
          res.status(404).json({ error: "Shipment (envio_id) not found" });
          return;
        }
      }

      await deliveryProof.update({
        envio_id: body.envio_id,
        fecha_hora: body.fecha_hora,
        receptor_nombre: body.receptor_nombre,
        receptor_documento: body.receptor_documento ?? deliveryProof.receptor_documento,
        firma_url: body.firma_url ?? deliveryProof.firma_url,
        foto_url: body.foto_url ?? deliveryProof.foto_url,
        geolocalizacion_lat: body.geolocalizacion_lat ?? deliveryProof.geolocalizacion_lat,
        geolocalizacion_lng: body.geolocalizacion_lng ?? deliveryProof.geolocalizacion_lng,
        observaciones: body.observaciones ?? deliveryProof.observaciones,
        estado: body.estado,
        is_active: body.is_active ?? deliveryProof.is_active,
      });

      res.status(200).json({ deliveryProof: deliveryProof });
    } catch (error) {
      res.status(500).json({ error: "Error updating deliveryProof (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<DeliveryProofI>;
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }

      await deliveryProof.update(body);
      res.status(200).json({ deliveryProof: deliveryProof });
    } catch (error) {
      res.status(500).json({ error: "Error updating deliveryProof (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminacion fisica */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }
      await deliveryProof.destroy();
      res.status(200).json({ message: "DeliveryProof permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting deliveryProof", detail: String(error) });
    }
  }

  /** Eliminacion logica -> is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const deliveryProof = await DeliveryProof.findByPk(id);
      if (!deliveryProof) {
        res.status(404).json({ error: "DeliveryProof not found" });
        return;
      }
      await deliveryProof.update({ is_active: false });
      res.status(200).json({
        message: "DeliveryProof deactivated (logical delete)",
        deliveryProof: deliveryProof,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating deliveryProof", detail: String(error) });
    }
  }
}
EOF
```
```bash
: > src/features/business/delivery-proof/delivery-proof.routes.ts
cat >> src/features/business/delivery-proof/delivery-proof.routes.ts << 'EOF'
import { Application } from "express";
import { DeliveryProofController } from "./delivery-proof.controller";

export class DeliveryProofRoutes {
  public deliveryProofController: DeliveryProofController = new DeliveryProofController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACION / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/delivery_proofs")
      .get(this.deliveryProofController.getAll.bind(this.deliveryProofController));

    // getOne
    app
      .route("/api/delivery_proofs/:id")
      .get(this.deliveryProofController.getOne.bind(this.deliveryProofController));

    // create
    app
      .route("/api/delivery_proofs")
      .post(this.deliveryProofController.create.bind(this.deliveryProofController));

    // update (PUT / PATCH)
    app
      .route("/api/delivery_proofs/:id")
      .put(this.deliveryProofController.updatePut.bind(this.deliveryProofController))
      .patch(this.deliveryProofController.updatePatch.bind(this.deliveryProofController));

    // delete fisico
    app
      .route("/api/delivery_proofs/:id")
      .delete(this.deliveryProofController.deletePhysical.bind(this.deliveryProofController));

    // delete logico
    app
      .route("/api/delivery_proofs/:id/deactivate")
      .patch(this.deliveryProofController.deleteLogical.bind(this.deliveryProofController));
  }
}
EOF
```

---

## 16.3 HTTP

```bash
: > src/features/business/delivery-proof/http/delivery_proofs.get.http
cat >> src/features/business/delivery-proof/http/delivery_proofs.get.http << 'EOF'
### Feature DeliveryProof — GET ALL / GET ONE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name getAllDeliveryProof
GET {{baseUrl}}/api/delivery_proofs

###

# @name getOneDeliveryProof
GET {{baseUrl}}/api/delivery_proofs/{{id}}
EOF
```
```bash
: > src/features/business/delivery-proof/http/delivery_proofs.create.http
cat >> src/features/business/delivery-proof/http/delivery_proofs.create.http << 'EOF'
### Feature DeliveryProof — CREATE
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000

# @name createDeliveryProof
POST {{baseUrl}}/api/delivery_proofs
Content-Type: application/json

{
  "envio_id": 1,
  "fecha_hora": "2026-01-15T10:00:00.000Z",
  "receptor_nombre": "Ejemplo receptor_nombre",
  "receptor_documento": "Ejemplo receptor_documento",
  "firma_url": "Ejemplo firma_url",
  "foto_url": "Ejemplo foto_url",
  "geolocalizacion_lat": 10.5,
  "geolocalizacion_lng": 10.5,
  "observaciones": "Ejemplo observaciones",
  "estado": "valida",
  "is_active": true
}
EOF
```
```bash
: > src/features/business/delivery-proof/http/delivery_proofs.update.http
cat >> src/features/business/delivery-proof/http/delivery_proofs.update.http << 'EOF'
### Feature DeliveryProof — UPDATE (PUT) / UPDATE (PATCH)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name updateDeliveryProofPut
PUT {{baseUrl}}/api/delivery_proofs/{{id}}
Content-Type: application/json

{
  "envio_id": 1,
  "fecha_hora": "2026-01-15T10:00:00.000Z",
  "receptor_nombre": "Ejemplo receptor_nombre",
  "receptor_documento": "Ejemplo receptor_documento",
  "firma_url": "Ejemplo firma_url",
  "foto_url": "Ejemplo foto_url",
  "geolocalizacion_lat": 10.5,
  "geolocalizacion_lng": 10.5,
  "observaciones": "Ejemplo observaciones",
  "estado": "valida",
  "is_active": true
}

###

# @name updateDeliveryProofPatch
PATCH {{baseUrl}}/api/delivery_proofs/{{id}}
Content-Type: application/json

{
  "fecha_hora": "2026-01-15T10:00:00.000Z"
}
EOF
```
```bash
: > src/features/business/delivery-proof/http/delivery_proofs.delete.http
cat >> src/features/business/delivery-proof/http/delivery_proofs.delete.http << 'EOF'
### Feature DeliveryProof — DELETE fisico / DELETE logico (is_active = false)
### Leyenda: SIN AUTH (sin middleware JWT / sin autenticacion)
@baseUrl = http://localhost:4000
@id = 1

# @name deleteDeliveryProofPhysical
DELETE {{baseUrl}}/api/delivery_proofs/{{id}}

###

# @name deleteDeliveryProofLogical
PATCH {{baseUrl}}/api/delivery_proofs/{{id}}/deactivate
EOF
```

---

## 16.4 Cableado Routes + Config

**PARCHE** — `src/routes/index.ts` **ya existe**.

1. **Debajo de** `import { TrackingEventRoutes } ...`, **añadir**:

```ts
import { DeliveryProofRoutes } from "../features/business/delivery-proof/delivery-proof.routes";
```

2. **Dentro de** `export class Routes`, **debajo de** `trackingEventRoutes`, **añadir**:

```ts
  public deliveryProofRoutes: DeliveryProofRoutes = new DeliveryProofRoutes();
```

**PARCHE** — `src/config/index.ts` **ya existe**.

1. **Debajo de** `import "../features/business/tracking-event/tracking-event.model";`, **añadir**:

```ts
import "../features/business/delivery-proof/delivery-proof.model";
```

2. **Dentro de** `routes()`, **debajo de** `this.routePrv.trackingEventRoutes.routes(this.app);`, **añadir**:

```ts
    this.routePrv.deliveryProofRoutes.routes(this.app);
```

---

## 16.5 Relación / asociaciones DeliveryProof

> `DeliveryProof` referencia: **Shipment**. Norma FK: `<tabla_singular>_id`.

```bash
: > src/features/business/delivery-proof/delivery-proof.associations.ts
cat >> src/features/business/delivery-proof/delivery-proof.associations.ts << 'EOF'
import { DeliveryProof } from "./delivery-proof.model";
import { Shipment } from "../shipment/shipment.model";

DeliveryProof.belongsTo(Shipment, { foreignKey: "envio_id", as: "shipment" });
Shipment.hasOne(DeliveryProof, { foreignKey: "envio_id", as: "deliveryProof" });
EOF
```
**PARCHE** — `src/config/index.ts` **ya existe**.

**Debajo de** `import "../features/business/delivery-proof/delivery-proof.model";` (y **encima de** `import { Routes }`), **añadir**:

```ts
import "../features/business/delivery-proof/delivery-proof.associations";
```

---

## 16.6 Seeder DeliveryProof

```bash
: > src/features/business/delivery-proof/delivery-proof.seeder.ts
cat >> src/features/business/delivery-proof/delivery-proof.seeder.ts << 'EOF'
import { faker } from "@faker-js/faker";
import { DeliveryProof } from "./delivery-proof.model";
import { Shipment } from "../shipment/shipment.model";

/**
 * Seeder del feature DeliveryProof (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedDeliveryProofs(count: number): Promise<number> {
  if (count <= 0) {
    console.log("\u23ed\ufe0f  delivery_proofs: count=0, se omite");
    return 0;
  }

  const existing = await DeliveryProof.count();
  if (existing > 0) {
    console.log(`\u23ed\ufe0f  delivery_proofs: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const shipmentList = await Shipment.findAll({ where: { is_active: true } });
  if (shipmentList.length === 0) {
    console.log("\u23ed\ufe0f  delivery_proofs: faltan dependencias activas (shipmentList), se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
      envio_id: faker.helpers.arrayElement(shipmentList).id,
      fecha_hora: faker.date.recent(),
      receptor_nombre: faker.person.fullName(),
      receptor_documento: faker.string.numeric(10),
      firma_url: faker.image.url(),
      foto_url: faker.image.url(),
      geolocalizacion_lat: Number(faker.location.latitude()),
      geolocalizacion_lng: Number(faker.location.longitude()),
      observaciones: faker.lorem.sentence(),
      estado: faker.helpers.arrayElement(["valida", "observada", "rechazada"]),
      is_active: true,
  }));

  await DeliveryProof.bulkCreate(rows);
  console.log(`\u2705 delivery_proofs: insertados ${count} registro(s) falsos`);
  return count;
}
EOF
```
**PARCHE** — `src/database/seeders/counts.ts` **ya existe**.

- **Dentro de** `SeedCounts`, **añadir** `delivery_proofs: number;`
- **Dentro de** `DEFAULT_SEED_COUNTS`, **añadir** `delivery_proofs: 15,`
- Lectura opcional por env: `SEED_DELIVERY_PROOFS`.

**PARCHE** — `src/database/seeders/index.ts` **ya existe**.

1. **Debajo de** el import del seeder anterior, **añadir** `import { seedDeliveryProofs } from "../../features/business/delivery-proof/delivery-proof.seeder";`
2. **Debajo de** `await seedTrackingEvents(counts.tracking_events);`, **añadir** `await seedDeliveryProofs(counts.delivery_proofs);`

---

## 16.7 Swagger DeliveryProof

```bash
: > src/features/business/delivery-proof/delivery-proof.swagger.ts
cat >> src/features/business/delivery-proof/delivery-proof.swagger.ts << 'EOF'
/**
 * Documentacion OpenAPI del feature DeliveryProof.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const deliveryProofSwagger = {
  tags: [
    {
      name: "DeliveryProofs",
      description: "CRUD de delivery_proofs — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/delivery_proofs": {
      get: {
        tags: ["DeliveryProofs"],
        summary: "Listar delivery_proofs activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de delivery_proofs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    delivery_proofs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/DeliveryProof" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["DeliveryProofs"],
        summary: "Crear deliveryProof",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DeliveryProofCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "DeliveryProof creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    deliveryProof: { $ref: "#/components/schemas/DeliveryProof" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/delivery_proofs/{id}": {
      get: {
        tags: ["DeliveryProofs"],
        summary: "Obtener deliveryProof por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "DeliveryProof encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    deliveryProof: { $ref: "#/components/schemas/DeliveryProof" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["DeliveryProofs"],
        summary: "Actualizar deliveryProof (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DeliveryProofCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["DeliveryProofs"],
        summary: "Actualizar deliveryProof (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DeliveryProofPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["DeliveryProofs"],
        summary: "Eliminar deliveryProof (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/delivery_proofs/{id}/deactivate": {
      patch: {
        tags: ["DeliveryProofs"],
        summary: "Eliminar deliveryProof (logico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      DeliveryProof: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      envio_id: { type: "integer", example: 1 },
      fecha_hora: { type: "string", format: "date-time" },
      receptor_nombre: { type: "string", example: "receptor_nombre" },
      receptor_documento: { type: "string", example: "receptor_documento" },
      firma_url: { type: "string", example: "firma_url" },
      foto_url: { type: "string", example: "foto_url" },
      geolocalizacion_lat: { type: "number", example: 10.5 },
      geolocalizacion_lng: { type: "number", example: 10.5 },
      observaciones: { type: "string" },
      estado: { type: "string", enum: ["valida", "observada", "rechazada"], example: "valida" },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      DeliveryProofCreate: {
        type: "object",
        required: ["envio_id", "fecha_hora", "receptor_nombre", "estado"],
        properties: {
      envio_id: { type: "integer", example: 1 },
      fecha_hora: { type: "string", format: "date-time" },
      receptor_nombre: { type: "string", example: "receptor_nombre" },
      receptor_documento: { type: "string", example: "receptor_documento" },
      firma_url: { type: "string", example: "firma_url" },
      foto_url: { type: "string", example: "foto_url" },
      geolocalizacion_lat: { type: "number", example: 10.5 },
      geolocalizacion_lng: { type: "number", example: 10.5 },
      observaciones: { type: "string" },
      estado: { type: "string", enum: ["valida", "observada", "rechazada"], example: "valida" },
      is_active: { type: "boolean", example: true },
        },
      },
      DeliveryProofPatch: {
        type: "object",
        properties: {
      envio_id: { type: "integer", example: 1 },
      fecha_hora: { type: "string", format: "date-time" },
      receptor_nombre: { type: "string", example: "receptor_nombre" },
      receptor_documento: { type: "string", example: "receptor_documento" },
      firma_url: { type: "string", example: "firma_url" },
      foto_url: { type: "string", example: "foto_url" },
      geolocalizacion_lat: { type: "number", example: 10.5 },
      geolocalizacion_lng: { type: "number", example: 10.5 },
      observaciones: { type: "string" },
      estado: { type: "string", enum: ["valida", "observada", "rechazada"], example: "valida" },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
EOF
```
**PARCHE** — `src/swagger/index.ts` **ya existe**.

1. **Debajo de** `import { trackingEventSwagger } ...`, **añadir** `import { deliveryProofSwagger } from "../features/business/delivery-proof/delivery-proof.swagger";`
2. **Dentro de** `featureSwaggerModules`, **debajo de** `trackingEventSwagger,`, **añadir** `deliveryProofSwagger,`

### Verificación

```bash
curl -s http://localhost:4000/api/delivery_proofs
```

![alt text](img-express/api_delivery_proofs.png)

### Cierre del ISS

```bash
npm run dev
```

![alt text](img-express/run_delivery_proofs.png)

![alt text](img-express/docs_delivery_proofs.png)

> El servidor debe arrancar sin error. Detenerlo con Ctrl+C antes de continuar.