import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

const securityResponses = { "401": unauthorizedResponse, "403": forbiddenResponse };
const idParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer", minimum: 1 },
};

export const resourceRolesSwagger = {
  tags: [
    {
      name: "Concesiones rol-recurso",
      description: "Crear, retirar y reactivar permisos (role-resource grants) — JWT + RBAC",
    },
  ],
  paths: {
    "/api/concesiones-rol": {
      get: {
        tags: ["Concesiones rol-recurso"],
        summary: "Listar concesiones activas",
        parameters: [
          { name: "role_id", in: "query", schema: { type: "integer", minimum: 1 } },
          { name: "resource_id", in: "query", schema: { type: "integer", minimum: 1 } },
        ],
        security: bearerSecurity,
        responses: { "200": { description: "Concesiones con resumen de rol/recurso" }, ...securityResponses },
      },
      post: {
        tags: ["Concesiones rol-recurso"],
        summary: "Conceder recurso a rol",
        description: "Reactiva una concesión inactiva. Rol y recurso deben estar activos.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ResourceRoleCreate" } },
          },
        },
        responses: {
          "201": { description: "Concesión creada o reactivada" },
          "400": { description: "IDs inválidos" },
          "404": { description: "Rol o recurso inexistente/inactivo" },
          "409": { description: "La concesión ya está activa" },
          ...securityResponses,
        },
      },
    },
    "/api/concesiones-rol/{id}": {
      get: {
        tags: ["Concesiones rol-recurso"],
        summary: "Consultar concesión",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Concesión encontrada" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...securityResponses,
        },
      },
    },
    "/api/concesiones-rol/{id}/deactivate": {
      patch: {
        tags: ["Concesiones rol-recurso"],
        summary: "Retirar permiso (borrado lógico)",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Permiso desactivado" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...securityResponses,
        },
      },
    },
    "/api/concesiones-rol/{id}/reactivate": {
      patch: {
        tags: ["Concesiones rol-recurso"],
        summary: "Reactivar permiso",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Permiso reactivado" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          "409": { description: "La concesión ya está activa" },
          ...securityResponses,
        },
      },
    },
  },
  components: {
    schemas: {
      ResourceRole: {
        type: "object",
        properties: {
          id: { type: "integer" },
          role_id: { type: "integer" },
          resource_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
          role: { type: "object", properties: { id: { type: "integer" }, name: { type: "string" } } },
          resource: {
            type: "object",
            properties: {
              id: { type: "integer" },
              method: { type: "string" },
              path: { type: "string" },
              description: { type: "string", nullable: true },
            },
          },
        },
      },
      ResourceRoleCreate: {
        type: "object",
        required: ["role_id", "resource_id"],
        properties: {
          role_id: { type: "integer", minimum: 1 },
          resource_id: { type: "integer", minimum: 1 },
        },
      },
    },
  },
};
