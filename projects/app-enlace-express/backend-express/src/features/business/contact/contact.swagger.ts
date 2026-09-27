/**
 * Documentacion OpenAPI del feature Contact.
 * Se agrega desde `src/swagger` (registry externo), no se monta aqui.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const contactSwagger = {
  tags: [
    {
      name: "Contacts",
      description: "CRUD de contacts — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/contacts": {
      get: {
        tags: ["Contacts"],
        summary: "Listar contacts activos",
        description: "SIN AUTH — retorna registros con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de contacts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contacts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Contact" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Contacts"],
        summary: "Crear contact",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Contact creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contact: { $ref: "#/components/schemas/Contact" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/contacts/{id}": {
      get: {
        tags: ["Contacts"],
        summary: "Obtener contact por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Contact encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    contact: { $ref: "#/components/schemas/Contact" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Contacts"],
        summary: "Actualizar contact (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Contacts"],
        summary: "Actualizar contact (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Contacts"],
        summary: "Eliminar contact (fisico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/contacts/{id}/deactivate": {
      patch: {
        tags: ["Contacts"],
        summary: "Eliminar contact (logico)",
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
      Contact: {
        type: "object",
        properties: {
      id: { type: "integer", example: 1 },
      empresa_id: { type: "integer", example: 1 },
      nombre: { type: "string", example: "nombre" },
      cargo: { type: "string", example: "cargo" },
      telefono: { type: "string", example: "telefono" },
      email: { type: "string", example: "email" },
      is_principal: { type: "boolean", example: true },
      is_active: { type: "boolean", example: true },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
        },
      },
      ContactCreate: {
        type: "object",
        required: ["empresa_id", "nombre"],
        properties: {
      empresa_id: { type: "integer", example: 1 },
      nombre: { type: "string", example: "nombre" },
      cargo: { type: "string", example: "cargo" },
      telefono: { type: "string", example: "telefono" },
      email: { type: "string", example: "email" },
      is_principal: { type: "boolean", example: true },
      is_active: { type: "boolean", example: true },
        },
      },
      ContactPatch: {
        type: "object",
        properties: {
      empresa_id: { type: "integer", example: 1 },
      nombre: { type: "string", example: "nombre" },
      cargo: { type: "string", example: "cargo" },
      telefono: { type: "string", example: "telefono" },
      email: { type: "string", example: "email" },
      is_principal: { type: "boolean", example: true },
      is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
