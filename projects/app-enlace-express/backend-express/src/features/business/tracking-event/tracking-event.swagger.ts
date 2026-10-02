export const trackingEventSwagger = {
  tags: [
    {
      name: "TrackingEvents",
      description: "CRUD de eventos de seguimiento — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/tracking_events": {
      get: {
        tags: ["TrackingEvents"],
        summary: "Listar eventos de seguimiento activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de eventos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tracking_events: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TrackingEvent" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["TrackingEvents"],
        summary: "Crear evento de seguimiento",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TrackingEventCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Evento creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    trackingEvent: { $ref: "#/components/schemas/TrackingEvent" },
                  },
                },
              },
            },
          },
          "404": { description: "Shipment o Messenger no encontrado" },
        },
      },
    },
    "/api/tracking_events/{id}": {
      get: {
        tags: ["TrackingEvents"],
        summary: "Obtener evento por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Evento encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    trackingEvent: { $ref: "#/components/schemas/TrackingEvent" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["TrackingEvents"],
        summary: "Actualizar evento (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TrackingEventCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado o referencia inexistente" },
        },
      },
      patch: {
        tags: ["TrackingEvents"],
        summary: "Actualizar evento (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TrackingEventPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado o referencia inexistente" },
        },
      },
      delete: {
        tags: ["TrackingEvents"],
        summary: "Eliminar evento (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/tracking_events/{id}/deactivate": {
      patch: {
        tags: ["TrackingEvents"],
        summary: "Desactivar evento (eliminación lógica)",
        description: "SIN AUTH — is_active = false",
        security: [],
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
      TrackingEvent: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          envio_id: { type: "integer", example: 1 },
          tipo: {
            type: "string",
            enum: ["recogido", "en_transito", "en_reparto", "novedad", "entregado", "devuelto"],
            example: "recogido",
          },
          fecha: { type: "string", format: "date-time" },
          ubicacion: { type: "string", nullable: true, example: "Centro" },
          observaciones: { type: "string", nullable: true, example: "Paquete recogido." },
          estado: {
            type: "string",
            enum: ["informativo", "novedad_leve", "novedad_critica"],
            example: "informativo",
          },
          registrado_por_id: { type: "integer", nullable: true, example: 1 },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      TrackingEventCreate: {
        type: "object",
        required: ["envio_id", "tipo", "fecha", "estado"],
        properties: {
          envio_id: { type: "integer", example: 1 },
          tipo: {
            type: "string",
            enum: ["recogido", "en_transito", "en_reparto", "novedad", "entregado", "devuelto"],
            example: "recogido",
          },
          fecha: { type: "string", format: "date-time" },
          ubicacion: { type: "string", nullable: true, example: "Centro" },
          observaciones: { type: "string", nullable: true, example: "Paquete recogido." },
          estado: {
            type: "string",
            enum: ["informativo", "novedad_leve", "novedad_critica"],
            example: "informativo",
          },
          registrado_por_id: { type: "integer", nullable: true, example: 1 },
          is_active: { type: "boolean", example: true },
        },
      },
      TrackingEventPatch: {
        type: "object",
        properties: {
          envio_id: { type: "integer", example: 1 },
          tipo: {
            type: "string",
            enum: ["recogido", "en_transito", "en_reparto", "novedad", "entregado", "devuelto"],
            example: "recogido",
          },
          fecha: { type: "string", format: "date-time" },
          ubicacion: { type: "string", nullable: true, example: "Centro" },
          observaciones: { type: "string", nullable: true, example: "Paquete recogido." },
          estado: {
            type: "string",
            enum: ["informativo", "novedad_leve", "novedad_critica"],
            example: "informativo",
          },
          registrado_por_id: { type: "integer", nullable: true, example: 1 },
          is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
