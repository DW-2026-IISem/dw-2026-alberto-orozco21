import { Op } from "sequelize";
import "../rbac.associations";
import { Resource } from "../resources/resource.model";
import { Role } from "../roles/role.model";
import { RoleUser } from "../role-users/role-user.model";
import { EffectivePermissionDto } from "./dto";

export class ResourceRolesRepository {
  public async findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    const assignments = await RoleUser.findAll({
      where: { user_id: userId, status: "active" },
      attributes: ["role_id"],
    });
    const roleIds = [...new Set(assignments.map(({ role_id }) => role_id))];
    if (roleIds.length === 0) return [];

    const roles = await Role.findAll({
      where: { id: { [Op.in]: roleIds }, status: "active" },
      attributes: ["id"],
      include: [
        {
          model: Resource,
          as: "resources",
          attributes: ["method", "path"],
          where: { status: "active" },
          required: true,
          through: {
            attributes: [],
            where: { status: "active" },
          },
        },
      ],
    });

    const permissions = new Map<string, EffectivePermissionDto>();
    for (const role of roles) {
      for (const resource of role.get("resources") as Resource[]) {
        permissions.set(`${resource.method}\n${resource.path}`, {
          method: resource.method,
          path: resource.path,
        });
      }
    }
    return [...permissions.values()];
  }
}
