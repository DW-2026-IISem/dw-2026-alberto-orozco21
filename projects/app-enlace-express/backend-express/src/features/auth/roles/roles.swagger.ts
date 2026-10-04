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

export const rolesSwagger = {
  tags: [{ name: "Roles", description: "Administración de roles — JWT + RBAC" }],
  paths: {
    "/api/roles": {
      get: {
        tags: ["Roles"],
        summary: "Listar roles activos",
        description: "El nombre del rol no concede permisos; estos dependen de resource_roles.",
        security: bearerSecurity,
        responses: { "200": { description: "Lista de roles" }, ...secured },
      },
      post: {
        tags: ["Roles"],
        summary: "Crear rol sin concesiones",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RoleCreate" } } },
        },
        responses: {
          "201": { description: "Rol creado sin permisos asociados" },
          "400": { description: "Datos inválidos" },
          "409": { description: "Nombre de rol duplicado" },
          ...secured,
        },
      },
    },
    "/api/roles/{id}": {
      get: {
        tags: ["Roles"],
        summary: "Obtener rol",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Rol encontrado" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...secured,
        },
      },
      put: {
        tags: ["Roles"],
        summary: "Reemplazar rol",
        security: bearerSecurity,
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RoleUpdate" } } },
        },
        responses: {
          "200": { description: "Rol actualizado" },
          "400": { description: "Datos inválidos" },
          "404": notFoundResponse,
          "409": { description: "Nombre de rol duplicado" },
          ...secured,
        },
      },
      patch: {
        tags: ["Roles"],
        summary: "Actualizar rol parcialmente",
        security: bearerSecurity,
        parameters: [idParameter],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RolePatch" } } },
        },
        responses: {
          "200": { description: "Rol actualizado" },
          "400": { description: "Datos inválidos" },
          "404": notFoundResponse,
          "409": { description: "Nombre de rol duplicado" },
          ...secured,
        },
      },
      delete: {
        tags: ["Roles"],
        summary: "Eliminar rol físicamente",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Rol y asignaciones asociadas eliminados" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...secured,
        },
      },
    },
    "/api/roles/{id}/deactivate": {
      patch: {
        tags: ["Roles"],
        summary: "Desactivar rol",
        description: "Las asignaciones siguen almacenadas, pero dejan de otorgar permisos.",
        security: bearerSecurity,
        parameters: [idParameter],
        responses: {
          "200": { description: "Rol desactivado" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...secured,
        },
      },
    },
  },
  components: {
    schemas: {
      Role: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string", example: "OPERADOR" },
          description: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RoleCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", maxLength: 80 },
          description: { type: "string", nullable: true, maxLength: 255 },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      RoleUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", maxLength: 80 },
          description: { type: "string", nullable: true, maxLength: 255 },
        },
      },
      RolePatch: {
        type: "object",
        minProperties: 1,
        properties: {
          name: { type: "string", maxLength: 80 },
          description: { type: "string", nullable: true, maxLength: 255 },
        },
      },
    },
  },
};
