import { CreationAttributes, Transaction } from "sequelize";
import { sequelize } from "../../../database/db";
import { ResourceRole } from "../resource-roles/resource-role.model";
import { RoleUser } from "../role-users/role-user.model";
import { Role } from "./role.model";

export class RolesRepository {
  public async findAllActive(): Promise<Role[]> {
    return Role.findAll({ where: { status: "active" }, order: [["id", "ASC"]] });
  }

  public async findById(id: number, transaction?: Transaction): Promise<Role | null> {
    return Role.findByPk(id, { transaction });
  }

  public async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name: name.trim().toUpperCase() } });
  }

  public async create(data: CreationAttributes<Role>): Promise<Role> {
    return Role.create(data);
  }

  public async update(role: Role, data: Partial<Role>): Promise<Role> {
    return role.update(data);
  }

  public async delete(role: Role): Promise<void> {
    await sequelize.transaction(async (transaction) => {
      await ResourceRole.destroy({ where: { role_id: role.id }, transaction });
      await RoleUser.destroy({ where: { role_id: role.id }, transaction });
      await role.destroy({ transaction });
    });
  }
}
