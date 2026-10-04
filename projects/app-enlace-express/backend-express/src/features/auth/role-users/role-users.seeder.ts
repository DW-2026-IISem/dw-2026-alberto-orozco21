import { AppError } from "../../../shared/errors/app-error";
import { Role } from "../roles/role.model";
import { User } from "../users/user.model";
import { RoleUser } from "./role-user.model";

export const SEED_ROLE_USERS = [
  { username: "admin", roleName: "ADMIN" },
  { username: "operador", roleName: "OPERADOR" },
] as const;

export async function seedRoleUsers(): Promise<number> {
  let created = 0;
  for (const item of SEED_ROLE_USERS) {
    const [user, role] = await Promise.all([
      User.findOne({ where: { username: item.username, status: "active" } }),
      Role.findOne({ where: { name: item.roleName, status: "active" } }),
    ]);
    if (!user || !role) {
      throw new AppError(
        500,
        `Cannot seed role assignment: active user "${item.username}" or role "${item.roleName}" is missing`
      );
    }

    const [assignment, wasCreated] = await RoleUser.findOrCreate({
      where: { user_id: user.id, role_id: role.id },
      defaults: { user_id: user.id, role_id: role.id, status: "active" },
    });
    if (wasCreated) {
      created++;
    } else if (assignment.status !== "active") {
      await assignment.update({ status: "active" });
    }
  }
  console.log(`✅ role_users: asignaciones reconciliadas (${SEED_ROLE_USERS.length}, ${created} nuevas)`);
  return created;
}
