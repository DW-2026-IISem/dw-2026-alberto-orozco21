import { bearerSecurity } from "../../../shared/http/swagger-security";

export const messengerSwagger = {
  tags: [
    {
      name: "Messengers",
      description: "CRUD de mensajeros — **JWT + RBAC** (requiere autenticación y permiso activo)",
    },
  ],
  paths: {
    "/api/messengers": {
      get: {
        tags: ["Messengers"],
        summary: "Listar mensajeros activos",
        description: "JWT + RBAC — retorna registros con is_active=true",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Lista de mensajeros",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messengers: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Messenger" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Messengers"],
        summary: "Crear mensajero",
        description: "JWT + RBAC",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessengerCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Mensajero creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messenger: { $ref: "#/components/schemas/Messenger" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/messengers/{id}": {
      get: {
        tags: ["Messengers"],
        summary: "Obtener mensajero por id",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Mensajero encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    messenger: { $ref: "#/components/schemas/Messenger" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Messengers"],
        summary: "Actualizar mensajero (PUT — reemplazo)",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessengerCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Messengers"],
        summary: "Actualizar mensajero (PATCH — parcial)",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessengerPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Messengers"],
        summary: "Eliminar mensajero (físico)",
        description: "JWT + RBAC — borra la fila",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/messengers/{id}/deactivate": {
      patch: {
        tags: ["Messengers"],
        summary: "Desactivar mensajero (eliminación lógica)",
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
      Messenger: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Ana Pérez" },
          documento_identidad: { type: "string", example: "1020304050" },
          telefono: { type: "string", nullable: true, example: "3001234567" },
          tipo_vehiculo: {
            type: "string",
            enum: ["moto", "carro", "bicicleta", "a_pie"],
            example: "moto",
          },
          placa_vehiculo: { type: "string", nullable: true, example: "ABC123" },
          zona_asignada: { type: "string", nullable: true, example: "Centro" },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      MessengerCreate: {
        type: "object",
        required: ["nombre", "documento_identidad", "tipo_vehiculo"],
        properties: {
          nombre: { type: "string", example: "Ana Pérez" },
          documento_identidad: { type: "string", example: "1020304050" },
          telefono: { type: "string", nullable: true, example: "3001234567" },
          tipo_vehiculo: {
            type: "string",
            enum: ["moto", "carro", "bicicleta", "a_pie"],
            example: "moto",
          },
          placa_vehiculo: { type: "string", nullable: true, example: "ABC123" },
          zona_asignada: { type: "string", nullable: true, example: "Centro" },
          is_active: { type: "boolean", example: true },
        },
      },
      MessengerPatch: {
        type: "object",
        properties: {
          nombre: { type: "string", example: "Ana Pérez" },
          documento_identidad: { type: "string", example: "1020304050" },
          telefono: { type: "string", nullable: true, example: "3001234567" },
          tipo_vehiculo: {
            type: "string",
            enum: ["moto", "carro", "bicicleta", "a_pie"],
            example: "moto",
          },
          placa_vehiculo: { type: "string", nullable: true, example: "ABC123" },
          zona_asignada: { type: "string", nullable: true, example: "Centro" },
          is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
