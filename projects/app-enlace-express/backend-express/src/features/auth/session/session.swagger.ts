import {
  bearerSecurity,
  openSecurity,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

export const sessionSwagger = {
  tags: [
    {
      name: "Sesión",
      description: "Inicio, renovación y cierre de sesión; perfil y permisos efectivos.",
    },
  ],
  paths: {
    "/api/sesion/login": {
      post: {
        tags: ["Sesión"],
        summary: "Iniciar sesión",
        description:
          "Ruta OPEN. Acepta username o correo. Las credenciales inválidas y usuarios inactivos reciben el mismo 401 genérico.",
        security: openSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Login" } } },
        },
        responses: {
          "200": { description: "Access token JWT y refresh token opaco" },
          "400": { description: "Identifier o password ausente o inválido" },
          "401": { description: "Credenciales inválidas" },
        },
      },
    },
    "/api/sesion/refresh": {
      post: {
        tags: ["Sesión"],
        summary: "Renovar tokens",
        description:
          "Ruta OPEN con refresh token. Rota el token de un solo uso; su reutilización revoca la familia.",
        security: openSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RefreshToken" } },
          },
        },
        responses: {
          "200": { description: "Nuevo par de tokens" },
          "400": { description: "Refresh token ausente" },
          "401": { description: "Refresh token inválido, expirado o reutilizado" },
        },
      },
    },
    "/api/sesion/logout": {
      post: {
        tags: ["Sesión"],
        summary: "Cerrar sesión",
        description: "Ruta OPEN; revoca el refresh token presentado. La operación es idempotente.",
        security: openSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RefreshToken" } },
          },
        },
        responses: {
          "200": { description: "Sesión cerrada" },
          "400": { description: "Refresh token ausente" },
        },
      },
    },
    "/api/sesion/perfil": {
      get: {
        tags: ["Sesión"],
        summary: "Consultar mi perfil",
        security: bearerSecurity,
        responses: {
          "200": { description: "Perfil propio; no incluye contraseña" },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/permisos": {
      get: {
        tags: ["Sesión"],
        summary: "Consultar mis permisos efectivos",
        security: bearerSecurity,
        responses: {
          "200": { description: "Permisos efectivos del usuario autenticado" },
          "401": unauthorizedResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      Login: {
        type: "object",
        required: ["identifier", "password"],
        properties: {
          identifier: { type: "string", description: "Username o email" },
          password: { type: "string", format: "password" },
        },
      },
      RefreshToken: {
        type: "object",
        required: ["refresh_token"],
        properties: {
          refresh_token: { type: "string", description: "Token opaco entregado al iniciar sesión" },
        },
      },
      SessionTokens: {
        type: "object",
        properties: {
          access_token: { type: "string" },
          token_type: { type: "string", example: "Bearer" },
          expires_in: { type: "integer", example: 900 },
          refresh_token: { type: "string" },
          refresh_expires_in: { type: "integer", example: 604800 },
        },
      },
      Profile: {
        type: "object",
        properties: {
          id: { type: "integer" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          avatar: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
    },
  },
};
