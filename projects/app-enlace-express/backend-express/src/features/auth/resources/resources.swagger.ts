import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

const secured = { "401": unauthorizedResponse, "403": forbiddenResponse };
const idParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer", minimum: 1 },
};

export const resourcesSwagger = {
  tags: [
    {
      name: "Recursos",
      description: "Catálogo RBAC de pares (method, path) — JWT + RBAC",
    },
  ],
  paths: {
    "/api/recursos": {
      get: {
        tags: ["Recursos"],
        summary: "Listar recursos activos",
        security: bearerSecurity,
        responses: { "200": { description: "Lista de recursos" }, ...secured },
      },
      post: {
        tags: ["Recursos"],
        summary: "Crear recurso",
        description: "El recurso representa un método HTTP y un patrón de ruta.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourceCreate" } },
          },
        },
        responses: {
          "201": { description: "Recurso creado" },
          "400": { description: "Método o ruta inválidos" },
          "409": { description: "El par method/path ya está registrado" },
          ...secured,
        },
      },
    },
    "/api/recursos/{id}": {
      get: {
        tags: ["Recursos"],
        summary: "Obtener recurso",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Recurso encontrado" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...secured,
        },
      },
      put: {
        tags: ["Recursos"],
        summary: "Reemplazar recurso",
        security: bearerSecurity,
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourceUpdate" } },
          },
        },
        responses: {
          "200": { description: "Recurso actualizado" },
          "400": { description: "Método o ruta inválidos" },
          "404": notFoundResponse,
          "409": { description: "El par method/path ya está registrado" },
          ...secured,
        },
      },
      patch: {
        tags: ["Recursos"],
        summary: "Actualizar recurso parcialmente",
        security: bearerSecurity,
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourcePatch" } },
          },
        },
        responses: {
          "200": { description: "Recurso actualizado" },
          "400": { description: "Método o ruta inválidos" },
          "404": notFoundResponse,
          "409": { description: "El par method/path ya está registrado" },
          ...secured,
        },
      },
      delete: {
        tags: ["Recursos"],
        summary: "Eliminar recurso físicamente",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Recurso y concesiones asociadas eliminados" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...secured,
        },
      },
    },
    "/api/recursos/{id}/deactivate": {
      patch: {
        tags: ["Recursos"],
        summary: "Desactivar recurso",
        description: "Las concesiones se conservan, pero el recurso inactivo no autoriza.",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Recurso desactivado" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...secured,
        },
      },
    },
  },
  components: {
    schemas: {
      Resource: {
        type: "object",
        properties: {
          id: { type: "integer" },
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string", example: "/api/shipments/:id" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ResourceCreate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string", maxLength: 255, example: "/api/shipments/:id" },
          description: { type: "string", nullable: true, maxLength: 255 },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      ResourceUpdate: {
        type: "object",
        required: ["method", "path"],
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string", maxLength: 255 },
          description: { type: "string", nullable: true, maxLength: 255 },
        },
      },
      ResourcePatch: {
        type: "object",
        minProperties: 1,
        properties: {
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          path: { type: "string", maxLength: 255 },
          description: { type: "string", nullable: true, maxLength: 255 },
        },
      },
    },
  },
};
