import { bearerSecurity } from "../../../shared/http/swagger-security";

export const deliveryProofSwagger = {
  tags: [
    {
      name: "DeliveryProofs",
      description: "CRUD de pruebas de entrega — **JWT + RBAC** (requiere autenticación y permiso activo)",
    },
  ],
  paths: {
    "/api/delivery_proofs": {
      get: {
        tags: ["DeliveryProofs"],
        summary: "Listar pruebas de entrega activas",
        description: "JWT + RBAC — retorna registros con is_active=true",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Lista de pruebas de entrega",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    delivery_proofs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/DeliveryProof" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["DeliveryProofs"],
        summary: "Crear prueba de entrega",
        description: "JWT + RBAC — solo se permite una prueba por envío",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DeliveryProofCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Prueba de entrega creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    deliveryProof: { $ref: "#/components/schemas/DeliveryProof" },
                  },
                },
              },
            },
          },
          "404": { description: "Envío no encontrado o ya tiene prueba de entrega" },
        },
      },
    },
    "/api/delivery_proofs/{id}": {
      get: {
        tags: ["DeliveryProofs"],
        summary: "Obtener prueba de entrega por id",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Prueba de entrega encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    deliveryProof: { $ref: "#/components/schemas/DeliveryProof" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrada" },
        },
      },
      put: {
        tags: ["DeliveryProofs"],
        summary: "Actualizar prueba de entrega (PUT — reemplazo)",
        description: "JWT + RBAC — solo se permite una prueba por envío",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DeliveryProofCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada, envío inexistente o envío ya asociado" },
        },
      },
      patch: {
        tags: ["DeliveryProofs"],
        summary: "Actualizar prueba de entrega (PATCH — parcial)",
        description: "JWT + RBAC — solo se permite una prueba por envío",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DeliveryProofPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada, envío inexistente o envío ya asociado" },
        },
      },
      delete: {
        tags: ["DeliveryProofs"],
        summary: "Eliminar prueba de entrega (físico)",
        description: "JWT + RBAC — borra la fila",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminada" },
          "404": { description: "No encontrada" },
        },
      },
    },
    "/api/delivery_proofs/{id}/deactivate": {
      patch: {
        tags: ["DeliveryProofs"],
        summary: "Desactivar prueba de entrega (eliminación lógica)",
        description: "JWT + RBAC — is_active = false",
        security: bearerSecurity,
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
      DeliveryProof: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          envio_id: { type: "integer", example: 1 },
          fecha_hora: { type: "string", format: "date-time" },
          receptor_nombre: { type: "string", example: "Alex Rivera" },
          receptor_documento: { type: "string", nullable: true, example: "1000000001" },
          firma_url: { type: "string", nullable: true, example: "https://example.com/signature.png" },
          foto_url: { type: "string", nullable: true, example: "https://example.com/delivery.jpg" },
          geolocalizacion_lat: { type: "number", nullable: true, example: 4.711 },
          geolocalizacion_lng: { type: "number", nullable: true, example: -74.0721 },
          observaciones: { type: "string", nullable: true, example: "Entrega recibida." },
          estado: { type: "string", enum: ["valida", "observada", "rechazada"], example: "valida" },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      DeliveryProofCreate: {
        type: "object",
        required: ["envio_id", "fecha_hora", "receptor_nombre", "estado"],
        properties: {
          envio_id: { type: "integer", example: 1 },
          fecha_hora: { type: "string", format: "date-time" },
          receptor_nombre: { type: "string", example: "Alex Rivera" },
          receptor_documento: { type: "string", nullable: true, example: "1000000001" },
          firma_url: { type: "string", nullable: true, example: "https://example.com/signature.png" },
          foto_url: { type: "string", nullable: true, example: "https://example.com/delivery.jpg" },
          geolocalizacion_lat: { type: "number", nullable: true, example: 4.711 },
          geolocalizacion_lng: { type: "number", nullable: true, example: -74.0721 },
          observaciones: { type: "string", nullable: true, example: "Entrega recibida." },
          estado: { type: "string", enum: ["valida", "observada", "rechazada"], example: "valida" },
          is_active: { type: "boolean", example: true },
        },
      },
      DeliveryProofPatch: {
        type: "object",
        properties: {
          envio_id: { type: "integer", example: 1 },
          fecha_hora: { type: "string", format: "date-time" },
          receptor_nombre: { type: "string", example: "Alex Rivera" },
          receptor_documento: { type: "string", nullable: true, example: "1000000001" },
          firma_url: { type: "string", nullable: true, example: "https://example.com/signature.png" },
          foto_url: { type: "string", nullable: true, example: "https://example.com/delivery.jpg" },
          geolocalizacion_lat: { type: "number", nullable: true, example: 4.711 },
          geolocalizacion_lng: { type: "number", nullable: true, example: -74.0721 },
          observaciones: { type: "string", nullable: true, example: "Entrega recibida." },
          estado: { type: "string", enum: ["valida", "observada", "rechazada"], example: "valida" },
          is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
