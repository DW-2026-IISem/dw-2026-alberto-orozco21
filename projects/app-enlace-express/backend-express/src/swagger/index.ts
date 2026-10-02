import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { companiesSwagger } from "../features/business/companies/companies.swagger";
import { contactSwagger } from "../features/business/contact/contact.swagger";
import { addressSwagger } from "../features/business/address/address.swagger";
import { messengerSwagger } from "../features/business/messenger/messenger.swagger";
import { rateSwagger } from "../features/business/rate/rate.swagger";
import { routeSwagger } from "../features/business/route/route.swagger";
import { shipmentSwagger } from "../features/business/shipment/shipment.swagger";

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
  contactSwagger,
  addressSwagger,
  messengerSwagger,
  rateSwagger,
  routeSwagger,
  shipmentSwagger
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
