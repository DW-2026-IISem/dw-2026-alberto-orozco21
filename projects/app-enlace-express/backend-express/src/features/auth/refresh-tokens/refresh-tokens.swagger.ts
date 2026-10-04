import {
  bearerSecurity,
  invalidIdResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

export const refreshTokensSwagger = {
  tags: [
    {
      name: "Sesiones",
      description:
        "Sesiones del usuario autenticado: listar, consultar y revocar mediante JWT (sin RBAC).",
    },
  ],
  paths: {
    "/api/sesiones": {
      get: {
        tags: ["Sesiones"],
        summary: "Listar mis sesiones activas",
        description: "Devuelve solo las sesiones del usuario autenticado; nunca incluye token_hash.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Sesiones propias" },
          "401": unauthorizedResponse,
        },
      },
      delete: {
        tags: ["Sesiones"],
        summary: "Purgar mis sesiones revocadas o expiradas",
        security: bearerSecurity,
        responses: {
          "200": { description: "Purga realizada" },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/sesiones/deactivate-all": {
      patch: {
        tags: ["Sesiones"],
        summary: "Revocar todas mis sesiones",
        security: bearerSecurity,
        responses: {
          "200": { description: "Sesiones revocadas" },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/sesiones/{id}": {
      get: {
        tags: ["Sesiones"],
        summary: "Consultar una sesión propia",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: {
          "200": { description: "Sesión propia" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "404": { description: "Sesión no encontrada o ajena" },
        },
      },
    },
    "/api/sesiones/{id}/deactivate": {
      patch: {
        tags: ["Sesiones"],
        summary: "Revocar una sesión propia",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
        responses: {
          "200": { description: "Sesión revocada" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "404": { description: "Sesión no encontrada o ajena" },
        },
      },
    },
  },
  components: {
    schemas: {
      Session: {
        type: "object",
        properties: {
          id: { type: "integer" },
          user_id: { type: "integer" },
          family_id: { type: "string", format: "uuid" },
          device_info: { type: "string", nullable: true },
          expires_at: { type: "string", format: "date-time" },
          status: { type: "string", enum: ["active", "inactive"] },
          is_expired: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};
