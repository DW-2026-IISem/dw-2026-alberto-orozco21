import { bearerSecurity } from "../../../shared/http/swagger-security";

export const rateSwagger = {
  tags: [
    {
      name: "Rates",
      description: "CRUD de tarifas — **JWT + RBAC** (requiere autenticación y permiso activo)",
    },
  ],
  paths: {
    "/api/rates": {
      get: {
        tags: ["Rates"],
        summary: "Listar tarifas activas",
        description: "JWT + RBAC — retorna registros con is_active=true",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Lista de tarifas",
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
        summary: "Crear tarifa",
        description: "JWT + RBAC",
        security: bearerSecurity,
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
            description: "Tarifa creada",
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
        summary: "Obtener tarifa por id",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Tarifa encontrada",
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
          "404": { description: "No encontrada" },
        },
      },
      put: {
        tags: ["Rates"],
        summary: "Actualizar tarifa (PUT — reemplazo)",
        description: "JWT + RBAC",
        security: bearerSecurity,
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
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada" },
        },
      },
      patch: {
        tags: ["Rates"],
        summary: "Actualizar tarifa (PATCH — parcial)",
        description: "JWT + RBAC",
        security: bearerSecurity,
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
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada" },
        },
      },
      delete: {
        tags: ["Rates"],
        summary: "Eliminar tarifa (físico)",
        description: "JWT + RBAC — borra la fila",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminada" },
          "404": { description: "No encontrada" },
        },
      },
    },
    "/api/rates/{id}/deactivate": {
      patch: {
        tags: ["Rates"],
        summary: "Desactivar tarifa (eliminación lógica)",
        description: "JWT + RBAC — is_active = false",
        security: bearerSecurity,
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
      Rate: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Tarifa estándar" },
          zona: { type: "string", example: "Centro" },
          regla_calculo: {
            type: "string",
            enum: ["por_peso", "por_zona", "plana"],
            example: "por_peso",
          },
          valor_base: { type: "number", example: 10000 },
          valor_por_kg_adicional: { type: "number", nullable: true, example: 1500 },
          recargo_urgente_pct: { type: "number", nullable: true, example: 15 },
          vigencia_desde: { type: "string", format: "date", example: "2026-01-15" },
          vigencia_hasta: { type: "string", format: "date", nullable: true, example: "2026-12-31" },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RateCreate: {
        type: "object",
        required: ["nombre", "zona", "regla_calculo", "valor_base", "vigencia_desde"],
        properties: {
          nombre: { type: "string", example: "Tarifa estándar" },
          zona: { type: "string", example: "Centro" },
          regla_calculo: {
            type: "string",
            enum: ["por_peso", "por_zona", "plana"],
            example: "por_peso",
          },
          valor_base: { type: "number", example: 10000 },
          valor_por_kg_adicional: { type: "number", nullable: true, example: 1500 },
          recargo_urgente_pct: { type: "number", nullable: true, example: 15 },
          vigencia_desde: { type: "string", format: "date", example: "2026-01-15" },
          vigencia_hasta: { type: "string", format: "date", nullable: true, example: "2026-12-31" },
          is_active: { type: "boolean", example: true },
        },
      },
      RatePatch: {
        type: "object",
        properties: {
          nombre: { type: "string", example: "Tarifa estándar" },
          zona: { type: "string", example: "Centro" },
          regla_calculo: {
            type: "string",
            enum: ["por_peso", "por_zona", "plana"],
            example: "por_peso",
          },
          valor_base: { type: "number", example: 10000 },
          valor_por_kg_adicional: { type: "number", nullable: true, example: 1500 },
          recargo_urgente_pct: { type: "number", nullable: true, example: 15 },
          vigencia_desde: { type: "string", format: "date", example: "2026-01-15" },
          vigencia_hasta: { type: "string", format: "date", nullable: true, example: "2026-12-31" },
          is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
