import { bearerSecurity } from "../../../shared/http/swagger-security";

export const invoiceSwagger = {
  tags: [
    {
      name: "Invoices",
      description: "CRUD de facturas — **JWT + RBAC** (requiere autenticación y permiso activo)",
    },
  ],
  paths: {
    "/api/invoices": {
      get: {
        tags: ["Invoices"],
        summary: "Listar facturas activas",
        description: "JWT + RBAC — retorna registros con is_active=true",
        security: bearerSecurity,
        responses: {
          "200": {
            description: "Lista de facturas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    invoices: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Invoice" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Invoices"],
        summary: "Crear factura",
        description: "JWT + RBAC",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InvoiceCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Factura creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    invoice: { $ref: "#/components/schemas/Invoice" },
                  },
                },
              },
            },
          },
          "404": { description: "Empresa no encontrada" },
        },
      },
    },
    "/api/invoices/{id}": {
      get: {
        tags: ["Invoices"],
        summary: "Obtener factura por id",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Factura encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    invoice: { $ref: "#/components/schemas/Invoice" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrada" },
        },
      },
      put: {
        tags: ["Invoices"],
        summary: "Actualizar factura (PUT — reemplazo)",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InvoiceCreate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada o empresa inexistente" },
        },
      },
      patch: {
        tags: ["Invoices"],
        summary: "Actualizar factura (PATCH — parcial)",
        description: "JWT + RBAC",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InvoicePatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizada" },
          "404": { description: "No encontrada o empresa inexistente" },
        },
      },
      delete: {
        tags: ["Invoices"],
        summary: "Eliminar factura (físico)",
        description: "JWT + RBAC — borra la fila",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminada" },
          "404": { description: "No encontrada" },
        },
      },
    },
    "/api/invoices/{id}/deactivate": {
      patch: {
        tags: ["Invoices"],
        summary: "Desactivar factura (eliminación lógica)",
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
      Invoice: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          numero: { type: "string", example: "FE-000001" },
          empresa_id: { type: "integer", example: 1 },
          periodo_desde: { type: "string", format: "date", example: "2026-01-01" },
          periodo_hasta: { type: "string", format: "date", example: "2026-01-31" },
          fecha: { type: "string", format: "date", example: "2026-02-01" },
          subtotal: { type: "number", example: 100000 },
          impuestos: { type: "number", nullable: true, example: 19000 },
          total: { type: "number", example: 119000 },
          estado: { type: "string", enum: ["pendiente", "pagada", "vencida", "anulada"], example: "pendiente" },
          fecha_pago: { type: "string", format: "date-time", nullable: true },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      InvoiceCreate: {
        type: "object",
        required: [
          "numero",
          "empresa_id",
          "periodo_desde",
          "periodo_hasta",
          "fecha",
          "subtotal",
          "total",
          "estado",
        ],
        properties: {
          numero: { type: "string", example: "FE-000001" },
          empresa_id: { type: "integer", example: 1 },
          periodo_desde: { type: "string", format: "date", example: "2026-01-01" },
          periodo_hasta: { type: "string", format: "date", example: "2026-01-31" },
          fecha: { type: "string", format: "date", example: "2026-02-01" },
          subtotal: { type: "number", example: 100000 },
          impuestos: { type: "number", nullable: true, example: 19000 },
          total: { type: "number", example: 119000 },
          estado: { type: "string", enum: ["pendiente", "pagada", "vencida", "anulada"], example: "pendiente" },
          fecha_pago: { type: "string", format: "date-time", nullable: true },
          is_active: { type: "boolean", example: true },
        },
      },
      InvoicePatch: {
        type: "object",
        properties: {
          numero: { type: "string", example: "FE-000001" },
          empresa_id: { type: "integer", example: 1 },
          periodo_desde: { type: "string", format: "date", example: "2026-01-01" },
          periodo_hasta: { type: "string", format: "date", example: "2026-01-31" },
          fecha: { type: "string", format: "date", example: "2026-02-01" },
          subtotal: { type: "number", example: 100000 },
          impuestos: { type: "number", nullable: true, example: 19000 },
          total: { type: "number", example: 119000 },
          estado: { type: "string", enum: ["pendiente", "pagada", "vencida", "anulada"], example: "pendiente" },
          fecha_pago: { type: "string", format: "date-time", nullable: true },
          is_active: { type: "boolean", example: true },
        },
      },
    },
  },
};
