export const packageSwagger = {
  tags: [
    {
      name: "Packages",
      description: "CRUD de paquetes — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/packages": {
      get: {
        tags: ["Packages"],
        summary: "Listar paquetes activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de paquetes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    packages: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Package" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Packages"],
        summary: "Crear paquete",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PackageCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Paquete creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    package: { $ref: "#/components/schemas/Package" },
                  },
                },
              },
            },
          },
          "404": { description: "Envío no encontrado" },
        },
      },
    },
    "/api/packages/{id}": {
      get: {
        tags: ["Packages"],
        summary: "Obtener paquete por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Paquete encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    package: { $ref: "#/components/schemas/Package" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Packages"],
        summary: "Actualizar paquete (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PackageCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado o envío no existente" },
        },
      },
      patch: {
        tags: ["Packages"],
        summary: "Actualizar paquete (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PackagePatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado o envío no existente" },
        },
      },
      delete: {
        tags: ["Packages"],
        summary: "Eliminar paquete (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/packages/{id}/deactivate": {
      patch: {
        tags: ["Packages"],
        summary: "Desactivar paquete (eliminación lógica)",
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
      Package: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          envio_id: { type: "integer", example: 1 },
          descripcion_contenido: { type: "string", nullable: true, example: "Ropa y accesorios" },
          peso_kg: { type: "number", example: 10.5 },
          alto_cm: { type: "number", nullable: true, example: 20 },
          ancho_cm: { type: "number", nullable: true, example: 15 },
          largo_cm: { type: "number", nullable: true, example: 30 },
          valor_declarado: { type: "number", nullable: true, example: 50000 },
          es_fragil: { type: "boolean", example: false },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PackageCreate: {
        type: "object",
        required: ["envio_id", "peso_kg"],
        properties: {
          envio_id: { type: "integer", example: 1 },
          descripcion_contenido: { type: "string", nullable: true, example: "Ropa y accesorios" },
          peso_kg: { type: "number", example: 10.5 },
          alto_cm: { type: "number", nullable: true, example: 20 },
          ancho_cm: { type: "number", nullable: true, example: 15 },
          largo_cm: { type: "number", nullable: true, example: 30 },
          valor_declarado: { type: "number", nullable: true, example: 50000 },
          es_fragil: { type: "boolean", example: false },
          is_active: { type: "boolean", example: true },
        },
      },
      PackagePatch: {
        type: "object",
        properties: {
          envio_id: { type: "integer", example: 1 },
          descripcion_contenido: { type: "string", nullable: true, example: "Ropa y accesorios" },
          peso_kg: { type: "number", example: 10.5 },
          alto_cm: { type: "number", nullable: true, example: 20 },
          ancho_cm: { type: "number", nullable: true, example: 15 },
          largo_cm: { type: "number", nullable: true, example: 30 },
          valor_declarado: { type: "number", nullable: true, example: 50000 },
          es_fragil: { type: "boolean", example: false },
          is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
