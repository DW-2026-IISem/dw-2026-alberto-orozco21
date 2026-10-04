import { CreationAttributes, Transaction } from "sequelize";
import "../rbac.associations";
import { Resource } from "../resources/resource.model";
import { Role } from "../roles/role.model";
import { RoleUser } from "../role-users/role-user.model";
import { EffectivePermissionDto } from "./dto";
import { ResourceRole } from "./resource-role.model";

const SUMMARIES = [
  { model: Role, as: "role", attributes: ["id", "name"] },
  { model: Resource, as: "resource", attributes: ["id", "method", "path", "description"] },
];

export class ResourceRolesRepository {
  public async findAllActiveFiltered(filters: {
    role_id?: number;
    resource_id?: number;
  }): Promise<ResourceRole[]> {
    const where: { status: "active"; role_id?: number; resource_id?: number } = {
      status: "active",
    };
    if (filters.role_id !== undefined) where.role_id = filters.role_id;
    if (filters.resource_id !== undefined) where.resource_id = filters.resource_id;
    return ResourceRole.findAll({
      where,
      include: SUMMARIES,
      order: [["id", "ASC"]],
    });
  }

  public async findById(id: number, transaction?: Transaction): Promise<ResourceRole | null> {
    return ResourceRole.findByPk(id, { include: SUMMARIES, transaction });
  }

  public async findByRoleAndResource(
    roleId: number,
    resourceId: number
  ): Promise<ResourceRole | null> {
    return ResourceRole.findOne({ where: { role_id: roleId, resource_id: resourceId } });
  }

  public async findAllByRole(roleId: number, transaction?: Transaction): Promise<ResourceRole[]> {
    return ResourceRole.findAll({ where: { role_id: roleId }, transaction });
  }

  public async create(
    data: CreationAttributes<ResourceRole>,
    transaction?: Transaction
  ): Promise<ResourceRole> {
    return ResourceRole.create(data, { transaction });
  }

  public async update(
    grant: ResourceRole,
    data: Partial<ResourceRole>,
    transaction?: Transaction
  ): Promise<ResourceRole> {
    return grant.update(data, { transaction });
  }

  public async findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    const grants = await ResourceRole.findAll({
      where: { status: "active" },
      attributes: ["id"],
      include: [
        {
          model: Role,
          as: "role",
          required: true,
          attributes: ["id", "name"],
          where: { status: "active" },
          include: [{
            model: RoleUser,
            as: "role_users",
            required: true,
            attributes: [],
            where: { user_id: userId, status: "active" },
          }],
        },
        {
          model: Resource,
          as: "resource",
          required: true,
          attributes: ["id", "method", "path", "description"],
          where: { status: "active" },
        }
      ],
      order: [["id", "ASC"]],
    });
    return grants.map((grant) => {
      const joined = grant as ResourceRole & { role: Role; resource: Resource };
      return {
        resource_id: joined.resource.id,
        method: joined.resource.method,
        path: joined.resource.path,
        description: joined.resource.description,
        role_id: joined.role.id,
        role_name: joined.role.name,
      };
    });
  }
}
