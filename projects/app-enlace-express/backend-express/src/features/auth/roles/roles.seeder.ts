import { Role } from "./role.model";

export const SEED_ROLES = [
  { name: "ADMIN", description: "Administración del sistema: gestiona usuarios, roles y permisos" },
  { name: "OPERADOR", description: "Rol operativo pendiente de matriz de permisos" },
] as const;

export async function seedRoles(): Promise<number> {
  let created = 0;
  for (const item of SEED_ROLES) {
    const [role, wasCreated] = await Role.findOrCreate({
      where: { name: item.name },
      defaults: { ...item, status: "active" },
    });
    if (wasCreated) {
      created++;
    } else if (role.status !== "active") {
      await role.update({ status: "active" });
    }
  }
  console.log(`✅ roles: catálogo reconciliado (${SEED_ROLES.length} roles, ${created} nuevos)`);
  return created;
}
