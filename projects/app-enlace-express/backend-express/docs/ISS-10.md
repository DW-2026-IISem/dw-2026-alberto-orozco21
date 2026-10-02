## ISS-10 — Feature Rate

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