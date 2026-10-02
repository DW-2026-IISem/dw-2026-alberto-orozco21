export const shipmentSwagger = {
  tags: [
    {
      name: "Shipments",
      description: "CRUD de envíos — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/shipments": {
      get: {
        tags: ["Shipments"],
        summary: "Listar envíos activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de envíos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    shipments: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Shipment" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Shipments"],
        summary: "Crear envío",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ShipmentCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Envío creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    shipment: { $ref: "#/components/schemas/Shipment" },
                  },
                },
              },
            },
          },
          "404": { description: "Una referencia no existe" },
        },
      },
    },
    "/api/shipments/{id}": {
      get: {
        tags: ["Shipments"],
        summary: "Obtener envío por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Envío encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    shipment: { $ref: "#/components/schemas/Shipment" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Shipments"],
        summary: "Actualizar envío (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ShipmentCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado o una referencia inexistente" },
        },
      },
      patch: {
        tags: ["Shipments"],
        summary: "Actualizar envío (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ShipmentPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado o una referencia inexistente" },
        },
      },
      delete: {
        tags: ["Shipments"],
        summary: "Eliminar envío (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/shipments/{id}/deactivate": {
      patch: {
        tags: ["Shipments"],
        summary: "Desactivar envío (eliminación lógica)",
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
      Shipment: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          numero_guia: { type: "string", example: "EE-ABC12345" },
          empresa_id: { type: "integer", example: 1 },
          contacto_origen_id: { type: "integer", example: 1 },
          direccion_origen_id: { type: "integer", example: 1 },
          contacto_destino_id: { type: "integer", example: 2 },
          direccion_destino_id: { type: "integer", example: 2 },
          mensajero_id: { type: "integer", nullable: true, example: 1 },
          ruta_id: { type: "integer", nullable: true, example: 1 },
          tarifa_id: { type: "integer", example: 1 },
          prioridad: { type: "string", enum: ["normal", "urgente", "express"], example: "normal" },
          peso_total_kg: { type: "number", example: 10.5 },
          valor_declarado: { type: "number", nullable: true, example: 50000 },
          costo_calculado: { type: "number", nullable: true, example: 12000 },
          estado: {
            type: "string",
            enum: ["creado", "cotizado", "asignado", "en_ruta", "entregado", "con_novedad", "cancelado"],
            example: "creado",
          },
          fecha_solicitud: { type: "string", format: "date-time" },
          fecha_entrega_estimada: { type: "string", format: "date-time", nullable: true },
          fecha_entrega_real: { type: "string", format: "date-time", nullable: true },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ShipmentCreate: {
        type: "object",
        required: [
          "numero_guia",
          "empresa_id",
          "contacto_origen_id",
          "direccion_origen_id",
          "contacto_destino_id",
          "direccion_destino_id",
          "tarifa_id",
          "prioridad",
          "peso_total_kg",
          "estado",
          "fecha_solicitud",
        ],
        properties: {
          numero_guia: { type: "string", example: "EE-ABC12345" },
          empresa_id: { type: "integer", example: 1 },
          contacto_origen_id: { type: "integer", example: 1 },
          direccion_origen_id: { type: "integer", example: 1 },
          contacto_destino_id: { type: "integer", example: 2 },
          direccion_destino_id: { type: "integer", example: 2 },
          mensajero_id: { type: "integer", nullable: true, example: 1 },
          ruta_id: { type: "integer", nullable: true, example: 1 },
          tarifa_id: { type: "integer", example: 1 },
          prioridad: { type: "string", enum: ["normal", "urgente", "express"], example: "normal" },
          peso_total_kg: { type: "number", example: 10.5 },
          valor_declarado: { type: "number", nullable: true, example: 50000 },
          costo_calculado: { type: "number", nullable: true, example: 12000 },
          estado: {
            type: "string",
            enum: ["creado", "cotizado", "asignado", "en_ruta", "entregado", "con_novedad", "cancelado"],
            example: "creado",
          },
          fecha_solicitud: { type: "string", format: "date-time" },
          fecha_entrega_estimada: { type: "string", format: "date-time", nullable: true },
          fecha_entrega_real: { type: "string", format: "date-time", nullable: true },
          is_active: { type: "boolean", example: true },
        },
      },
      ShipmentPatch: {
        type: "object",
        properties: {
          numero_guia: { type: "string", example: "EE-ABC12345" },
          empresa_id: { type: "integer", example: 1 },
          contacto_origen_id: { type: "integer", example: 1 },
          direccion_origen_id: { type: "integer", example: 1 },
          contacto_destino_id: { type: "integer", example: 2 },
          direccion_destino_id: { type: "integer", example: 2 },
          mensajero_id: { type: "integer", nullable: true, example: 1 },
          ruta_id: { type: "integer", nullable: true, example: 1 },
          tarifa_id: { type: "integer", example: 1 },
          prioridad: { type: "string", enum: ["normal", "urgente", "express"], example: "normal" },
          peso_total_kg: { type: "number", example: 10.5 },
          valor_declarado: { type: "number", nullable: true, example: 50000 },
          costo_calculado: { type: "number", nullable: true, example: 12000 },
          estado: {
            type: "string",
            enum: ["creado", "cotizado", "asignado", "en_ruta", "entregado", "con_novedad", "cancelado"],
            example: "creado",
          },
          fecha_solicitud: { type: "string", format: "date-time" },
          fecha_entrega_estimada: { type: "string", format: "date-time", nullable: true },
          fecha_entrega_real: { type: "string", format: "date-time", nullable: true },
          is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
