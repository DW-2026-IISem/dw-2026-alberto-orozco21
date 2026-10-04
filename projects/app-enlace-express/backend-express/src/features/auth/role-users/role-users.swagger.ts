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

export const roleUsersSwagger = {
  tags: [
    {
      name: "Asignaciones usuario-rol",
      description: "Asignaciones de roles a usuarios — JWT + RBAC",
    },
  ],
  paths: {
    "/api/asignaciones-rol": {
      get: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Listar asignaciones activas",
        security: bearerSecurity,
        responses: { "200": { description: "Asignaciones con resumen de usuario y rol" }, ...securityResponses },
      },
      post: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Asignar rol a usuario",
        description: "Reactiva la pareja si ya existía inactiva. Usuario y rol deben estar activos.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RoleUserCreate" } } },
        },
        responses: {
          "201": { description: "Asignación creada o reactivada" },
          "400": { description: "IDs inválidos" },
          "404": { description: "Usuario o rol inexistente/inactivo" },
          "409": { description: "La asignación ya está activa" },
          ...securityResponses,
        },
      },
    },
    "/api/asignaciones-rol/{id}": {
      get: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Consultar asignación",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Asignación encontrada" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...securityResponses,
        },
      },
    },
    "/api/asignaciones-rol/{id}/deactivate": {
      patch: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Retirar rol (borrado lógico)",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Asignación desactivada" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...securityResponses,
        },
      },
    },
    "/api/asignaciones-rol/{id}/reactivate": {
      patch: {
        tags: ["Asignaciones usuario-rol"],
        summary: "Reactivar asignación",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Asignación reactivada" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          "409": { description: "La asignación ya está activa" },
          ...securityResponses,
        },
      },
    },
  },
  components: {
    schemas: {
      RoleUser: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          role_id: { type: "integer" },
          status: { type: "string", enum: ["active", "inactive"] },
          user: {
            type: "object",
            properties: {
              id: { type: "integer" },
              username: { type: "string" },
              email: { type: "string", format: "email" },
            },
          },
          role: { type: "object", properties: { id: { type: "integer" }, name: { type: "string" } } },
        },
      },
      RoleUserCreate: {
        type: "object",
        required: ["user_id", "role_id"],
        properties: {
          user_id: { type: "integer", minimum: 1 },
          role_id: { type: "integer", minimum: 1 },
        },
      },
    },
  },
};
