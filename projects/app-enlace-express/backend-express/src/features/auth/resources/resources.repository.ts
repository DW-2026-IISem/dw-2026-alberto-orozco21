import { CreationAttributes, Transaction } from "sequelize";
import { sequelize } from "../../../database/db";
import { normalizePath } from "../../../shared/auth/resource-match";
import { ResourceRole } from "../resource-roles/resource-role.model";
import { Resource } from "./resource.model";

export class ResourcesRepository {
  public async findAllActive(): Promise<Resource[]> {
    return Resource.findAll({ where: { status: "active" }, order: [["id", "ASC"]] });
  }

  public async findById(id: number, transaction?: Transaction): Promise<Resource | null> {
    return Resource.findByPk(id, { transaction });
  }

  public async findByOperation(method: string, path: string): Promise<Resource | null> {
    return Resource.findOne({
      where: { method: method.trim().toUpperCase(), path: normalizePath(path.trim()) },
    });
  }

  public async create(data: CreationAttributes<Resource>): Promise<Resource> {
    return Resource.create(data);
  }

  public async update(resource: Resource, data: Partial<Resource>): Promise<Resource> {
    return resource.update(data);
  }

  public async delete(resource: Resource): Promise<void> {
    await sequelize.transaction(async (transaction) => {
      await ResourceRole.destroy({ where: { resource_id: resource.id }, transaction });
      await resource.destroy({ transaction });
    });
  }
}
