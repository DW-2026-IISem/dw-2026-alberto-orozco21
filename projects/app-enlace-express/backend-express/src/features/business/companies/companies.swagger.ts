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
      name: "Companies",
      description: "CRUD de empresas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/companies": {
      get: {
        tags: ["Companies"],
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
        tags: ["Companies"],
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
        tags: ["Companies"],
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
        tags: ["Companies"],
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
        tags: ["Companies"],
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
        tags: ["Companies"],
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
        tags: ["Companies"],
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
