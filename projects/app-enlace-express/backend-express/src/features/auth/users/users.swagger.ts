import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

const securedResponses = {
  "401": unauthorizedResponse,
  "403": forbiddenResponse,
};

const userIdParameter = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "integer", minimum: 1 },
};

export const usersSwagger = {
  tags: [
    {
      name: "Usuarios",
      description: "Administración de identidades y consulta de permisos efectivos — JWT + RBAC",
    },
  ],
  paths: {
    "/api/usuarios": {
      get: {
        tags: ["Usuarios"],
        summary: "Listar usuarios activos",
        description: "Requiere un permiso activo para GET /api/usuarios. Nunca devuelve password.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Lista de usuarios activos" },
          ...securedResponses,
        },
      },
      post: {
        tags: ["Usuarios"],
        summary: "Crear usuario",
        description: "La contraseña se almacena como hash y nunca se devuelve.",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserCreate" } } },
        },
        responses: {
          "201": { description: "Usuario creado" },
          "400": { description: "Datos inválidos" },
          "409": { description: "Username o email ya están en uso" },
          ...securedResponses,
        },
      },
    },
    "/api/usuarios/{id}": {
      get: {
        tags: ["Usuarios"],
        summary: "Obtener usuario activo",
        security: bearerSecurity,
        parameters: [userIdParameter],
        responses: {
          "200": { description: "Usuario encontrado" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...securedResponses,
        },
      },
      put: {
        tags: ["Usuarios"],
        summary: "Reemplazar identidad",
        description: "No permite cambiar contraseña o estado.",
        security: bearerSecurity,
        parameters: [userIdParameter],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserUpdate" } } },
        },
        responses: {
          "200": { description: "Usuario actualizado" },
          "400": { description: "Datos inválidos" },
          "404": notFoundResponse,
          "409": { description: "Username o email ya están en uso" },
          ...securedResponses,
        },
      },
      patch: {
        tags: ["Usuarios"],
        summary: "Actualizar parcialmente una identidad",
        description: "Solo acepta username, email y avatar.",
        security: bearerSecurity,
        parameters: [userIdParameter],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserPatch" } } },
        },
        responses: {
          "200": { description: "Usuario actualizado" },
          "400": { description: "Datos inválidos" },
          "404": notFoundResponse,
          "409": { description: "Username o email ya están en uso" },
          ...securedResponses,
        },
      },
      delete: {
        tags: ["Usuarios"],
        summary: "Eliminar usuario permanentemente",
        security: bearerSecurity,
        parameters: [userIdParameter],
        responses: {
          "200": { description: "Usuario eliminado" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...securedResponses,
        },
      },
    },
    "/api/usuarios/{id}/deactivate": {
      patch: {
        tags: ["Usuarios"],
        summary: "Desactivar usuario (borrado lógico)",
        security: bearerSecurity,
        parameters: [userIdParameter],
        responses: {
          "200": { description: "Usuario desactivado" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...securedResponses,
        },
      },
    },
    "/api/usuarios/{id}/password": {
      patch: {
        tags: ["Usuarios"],
        summary: "Cambiar contraseña",
        description: "Requiere la contraseña actual y una nueva de al menos 8 caracteres.",
        security: bearerSecurity,
        parameters: [userIdParameter],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ChangePassword" } },
          },
        },
        responses: {
          "200": { description: "Contraseña actualizada" },
          "400": { description: "Credenciales actuales incorrectas o datos inválidos" },
          "404": notFoundResponse,
          ...securedResponses,
        },
      },
    },
    "/api/usuarios/{id}/permisos": {
      get: {
        tags: ["Usuarios"],
        summary: "Consultar permisos efectivos",
        description:
          "Devuelve los recursos activos concedidos por asignaciones de roles activas.",
        security: bearerSecurity,
        parameters: [userIdParameter],
        responses: {
          "200": { description: "Lista de pares method/path efectivos" },
          "400": invalidIdResponse,
          "404": notFoundResponse,
          ...securedResponses,
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          avatar: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserCreate: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", minLength: 3, maxLength: 80 },
          email: { type: "string", format: "email", maxLength: 150 },
          password: { type: "string", format: "password", minLength: 8 },
          avatar: { type: "string", nullable: true, maxLength: 500 },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      UserUpdate: {
        type: "object",
        required: ["username", "email"],
        properties: {
          username: { type: "string", minLength: 3, maxLength: 80 },
          email: { type: "string", format: "email", maxLength: 150 },
          avatar: { type: "string", nullable: true, maxLength: 500 },
        },
      },
      UserPatch: {
        type: "object",
        minProperties: 1,
        properties: {
          username: { type: "string", minLength: 3, maxLength: 80 },
          email: { type: "string", format: "email", maxLength: 150 },
          avatar: { type: "string", nullable: true, maxLength: 500 },
        },
      },
      ChangePassword: {
        type: "object",
        required: ["current_password", "new_password"],
        properties: {
          current_password: { type: "string", format: "password" },
          new_password: { type: "string", format: "password", minLength: 8 },
        },
      },
    },
  },
};
