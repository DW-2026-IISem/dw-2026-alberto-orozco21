export interface CatalogResource {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
}

const STANDARD_OPERATIONS = [
  { method: "GET", suffix: "", action: "Listar" },
  { method: "GET", suffix: "/:id", action: "Consultar" },
  { method: "POST", suffix: "", action: "Crear" },
  { method: "PUT", suffix: "/:id", action: "Reemplazar" },
  { method: "PATCH", suffix: "/:id", action: "Modificar" },
  { method: "DELETE", suffix: "/:id", action: "Eliminar" },
  { method: "PATCH", suffix: "/:id/deactivate", action: "Desactivar" },
] as const;

const BUSINESS_FEATURES = [
  ["companies", "companies"],
  ["contacts", "contacts"],
  ["address", "address"],
  ["messengers", "messengers"],
  ["rates", "rates"],
  ["routes", "routes"],
  ["shipments", "shipments"],
  ["packages", "packages"],
  ["tracking_events", "tracking_events"],
  ["delivery_proofs", "delivery_proofs"],
  ["invoices", "invoices"],
] as const;

const businessResources: CatalogResource[] = BUSINESS_FEATURES.flatMap(
  ([route, label]) =>
    STANDARD_OPERATIONS.map(({ method, suffix, action }) => ({
      method,
      path: `/api/${route}${suffix}`,
      description: `${action} ${label}`,
    }))
);

const AUTH_STANDARD_FEATURES = ["roles", "recursos"] as const;
const authResources: CatalogResource[] = [
  ...AUTH_STANDARD_FEATURES.flatMap((feature) =>
    STANDARD_OPERATIONS.map(({ method, suffix, action }) => ({
      method,
      path: `/api/${feature}${suffix}`,
      description: `${action} ${feature}`,
    }))
  ),
  ...STANDARD_OPERATIONS.map(({ method, suffix, action }) => ({
    method,
    path: `/api/usuarios${suffix}`,
    description: `${action} usuarios`,
  })),
  { method: "PATCH", path: "/api/usuarios/:id/password", description: "Cambiar contraseña" },
  { method: "GET", path: "/api/usuarios/:id/permisos", description: "Consultar permisos efectivos" },
  { method: "GET", path: "/api/asignaciones-rol", description: "Listar asignaciones de roles" },
  { method: "GET", path: "/api/asignaciones-rol/:id", description: "Consultar asignación de rol" },
  { method: "POST", path: "/api/asignaciones-rol", description: "Asignar rol a usuario" },
  {
    method: "PATCH",
    path: "/api/asignaciones-rol/:id/deactivate",
    description: "Retirar rol de usuario",
  },
  {
    method: "PATCH",
    path: "/api/asignaciones-rol/:id/reactivate",
    description: "Reactivar rol de usuario",
  },
  { method: "GET", path: "/api/concesiones-rol", description: "Listar concesiones de roles" },
  { method: "GET", path: "/api/concesiones-rol/:id", description: "Consultar concesión de rol" },
  { method: "POST", path: "/api/concesiones-rol", description: "Conceder recurso a rol" },
  {
    method: "PATCH",
    path: "/api/concesiones-rol/:id/deactivate",
    description: "Retirar recurso de rol",
  },
  {
    method: "PATCH",
    path: "/api/concesiones-rol/:id/reactivate",
    description: "Reactivar recurso de rol",
  },
];

export const RESOURCE_CATALOG: readonly CatalogResource[] = [
  ...authResources,
  ...businessResources,
];

export const OPERADOR_RESOURCES: readonly CatalogResource[] = [];
