import { bearerSecurity } from "../../../shared/http/swagger-security";

/**
 * Documentacion OpenAPI del feature Address.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints protegidos con JWT + RBAC.
 */

export const addressSwagger = {
  tags: [
    {
      name: "Addresses",
      description: "CRUD de addresses — **JWT + RBAC** (requiere autenticación y permiso activo)",
    },
  ],
  paths: {
    "/api/address": {
      get: {
        tags: ["Addresses"],
        summary: "Listar addresses activos",
        description: "JWT + RBAC — retorna registros con is_active=true",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Lista de addresses",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    addresses: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Address" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Addresses"],
        summary: "Crear address",
        description: "JWT + RBAC",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddressCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Address creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    address: { $ref: "#/components/schemas/Address" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/address/{id}": {
      get: {
        tags: ["Addresses"],
        summary: "Obtener address por id",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Address encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    address: { $ref: "#/components/schemas/Address" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Addresses"],
        summary: "Actualizar address (PUT — reemplazo)",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddressCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Addresses"],
        summary: "Actualizar address (PATCH — parcial)",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddressPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Addresses"],
        summary: "Eliminar address (fisico)",
        description: "JWT + RBAC — borra la fila",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/address/{id}/deactivate": {
      patch: {
        tags: ["Addresses"],
        summary: "Eliminar address (logico)",
        description: "JWT + RBAC — is_active = false",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Address: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      empresa_id: { type: "integer", example: 1 },
      alias: { type: "string", example: "alias" },
      linea1: { type: "string", example: "linea1" },
      linea2: { type: "string", example: "linea2" },
      ciudad: { type: "string", example: "ciudad" },
      departamento: { type: "string", example: "departamento" },
      pais: { type: "string", example: "pais" },
      codigo_postal: { type: "string", example: "codigo_postal" },
      latitud: { type: "number", example: 10.5 },
      longitud: { type: "number", example: 10.5 },
      tipo: { type: "string", enum: ["recogida", "entrega", "mixta"], example: "recogida" },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      AddressCreate: {
        type: "object",
        required: ["empresa_id", "alias", "linea1", "ciudad", "tipo"],
        properties: {
      empresa_id: { type: "integer", example: 1 },
      alias: { type: "string", example: "alias" },
      linea1: { type: "string", example: "linea1" },
      linea2: { type: "string", example: "linea2" },
      ciudad: { type: "string", example: "ciudad" },
      departamento: { type: "string", example: "departamento" },
      pais: { type: "string", example: "pais" },
      codigo_postal: { type: "string", example: "codigo_postal" },
      latitud: { type: "number", example: 10.5 },
      longitud: { type: "number", example: 10.5 },
      tipo: { type: "string", enum: ["recogida", "entrega", "mixta"], example: "recogida" },
      is_active: { type: "boolean", example: true },
        },
      },
      AddressPatch: {
        type: "object",
        properties: {
      empresa_id: { type: "integer", example: 1 },
      alias: { type: "string", example: "alias" },
      linea1: { type: "string", example: "linea1" },
      linea2: { type: "string", example: "linea2" },
      ciudad: { type: "string", example: "ciudad" },
      departamento: { type: "string", example: "departamento" },
      pais: { type: "string", example: "pais" },
      codigo_postal: { type: "string", example: "codigo_postal" },
      latitud: { type: "number", example: 10.5 },
      longitud: { type: "number", example: 10.5 },
      tipo: { type: "string", enum: ["recogida", "entrega", "mixta"], example: "recogida" },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
