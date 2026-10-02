export const routeSwagger = {
  tags: [
    {
      name: "Routes",
      description: "CRUD de rutas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/routes": {
      get: {
        tags: ["Routes"],
        summary: "Listar rutas activas",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de rutas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    routes: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Route" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Routes"],
        summary: "Crear ruta",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RouteCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Ruta creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    route: { $ref: "#/components/schemas/Route" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/routes/{id}": {
      get: {
        tags: ["Routes"],
        summary: "Obtener ruta por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Ruta encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    route: { $ref: "#/components/schemas/Route" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrada" },
        },
      },
      put: {
        tags: ["Routes"],
        summary: "Actualizar ruta (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RouteCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada" },
        },
      },
      patch: {
        tags: ["Routes"],
        summary: "Actualizar ruta (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RoutePatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada" },
        },
      },
      delete: {
        tags: ["Routes"],
        summary: "Eliminar ruta (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminada" },
          "404": { description: "No encontrada" },
        },
      },
    },
    "/api/routes/{id}/deactivate": {
      patch: {
        tags: ["Routes"],
        summary: "Desactivar ruta (eliminación lógica)",
        description: "SIN AUTH — is_active = false",
        security: [],
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
      Route: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          nombre: { type: "string", example: "Ruta Centro" },
          mensajero_id: { type: "integer", example: 1 },
          zona_cobertura: { type: "string", nullable: true, example: "Centro" },
          fecha: { type: "string", format: "date", example: "2026-01-15" },
          hora_inicio: { type: "string", format: "date-time", nullable: true },
          hora_fin: { type: "string", format: "date-time", nullable: true },
          estado: {
            type: "string",
            enum: ["planificada", "en_curso", "finalizada"],
            example: "planificada",
          },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RouteCreate: {
        type: "object",
        required: ["nombre", "mensajero_id", "fecha", "estado"],
        properties: {
          nombre: { type: "string", example: "Ruta Centro" },
          mensajero_id: { type: "integer", example: 1 },
          zona_cobertura: { type: "string", nullable: true, example: "Centro" },
          fecha: { type: "string", format: "date", example: "2026-01-15" },
          hora_inicio: { type: "string", format: "date-time", nullable: true },
          hora_fin: { type: "string", format: "date-time", nullable: true },
          estado: {
            type: "string",
            enum: ["planificada", "en_curso", "finalizada"],
            example: "planificada",
          },
          is_active: { type: "boolean", example: true },
        },
      },
      RoutePatch: {
        type: "object",
        properties: {
          nombre: { type: "string", example: "Ruta Centro" },
          mensajero_id: { type: "integer", example: 1 },
          zona_cobertura: { type: "string", nullable: true, example: "Centro" },
          fecha: { type: "string", format: "date", example: "2026-01-15" },
          hora_inicio: { type: "string", format: "date-time", nullable: true },
          hora_fin: { type: "string", format: "date-time", nullable: true },
          estado: {
            type: "string",
            enum: ["planificada", "en_curso", "finalizada"],
            example: "planificada",
          },
          is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
