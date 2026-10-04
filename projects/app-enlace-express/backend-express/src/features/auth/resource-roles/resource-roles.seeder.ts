import { AppError } from "../../../shared/errors/app-error";
import { Resource } from "../resources/resource.model";
import { OPERADOR_RESOURCES, RESOURCE_CATALOG } from "../resources/resource-catalog";
import { Role } from "../roles/role.model";
import { ResourceRolesService } from "./resource-roles.service";

function catalogIds(
  resources: Resource[],
  catalog: ReadonlyArray<{ method: string; path: string }>
): number[] {
  const ids = new Map(resources.map((resource) => [`${resource.method} ${resource.path}`, resource.id]));
  return catalog.map((item) => {
    const id = ids.get(`${item.method} ${item.path}`);
    if (id === undefined) {
      throw new AppError(500, `Resource catalog entry is missing: ${item.method} ${item.path}`);
    }
    return id;
  });
}

export async function seedResourceRoles(): Promise<number> {
  const service = new ResourceRolesService();
  const resources = await Resource.findAll({ where: { status: "active" } });
  const admin = await Role.findOne({ where: { name: "ADMIN", status: "active" } });
  const operator = await Role.findOne({ where: { name: "OPERADOR", status: "active" } });
  if (!admin || !operator) {
    throw new AppError(500, "Active ADMIN and OPERADOR roles must be seeded before resource grants");
  }

  const adminResult = await service.reconcileRole(
    admin.id,
    catalogIds(resources, RESOURCE_CATALOG)
  );
  const operatorResult = await service.reconcileRole(
    operator.id,
    catalogIds(resources, OPERADOR_RESOURCES)
  );
  console.log(
    `✅ resource_roles: ADMIN=${adminResult.total_active}, OPERADOR=${operatorResult.total_active}`
  );
  return adminResult.total_active + operatorResult.total_active;
}
