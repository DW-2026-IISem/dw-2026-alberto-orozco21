import { UniqueConstraintError } from "sequelize";
import { AppError } from "../../../shared/errors/app-error";
import { withTransaction } from "../../../shared/database/with-transaction";
import { ResourcesRepository } from "../resources/resources.repository";
import { RolesRepository } from "../roles/roles.repository";
import {
  CreateResourceRoleDto,
  EffectivePermissionDto,
  ListResourceRolesDto,
  ResourceRoleResponseDto,
  toResourceRoleResponse,
} from "./dto";
import { ResourceRole } from "./resource-role.model";
import { ResourceRolesRepository } from "./resource-roles.repository";

export interface ReconcileResult {
  role_id: number;
  activated: number;
  deactivated: number;
  total_active: number;
}

export class ResourceRolesService {
  public constructor(
    private readonly repository: ResourceRolesRepository = new ResourceRolesRepository(),
    private readonly rolesRepository: RolesRepository = new RolesRepository(),
    private readonly resourcesRepository: ResourcesRepository = new ResourcesRepository()
  ) {}

  public async getAll(filters: ListResourceRolesDto = {}): Promise<ResourceRoleResponseDto[]> {
    return (await this.repository.findAllActiveFiltered(filters)).map(toResourceRoleResponse);
  }

  public async getOne(id: number): Promise<ResourceRoleResponseDto> {
    return toResourceRoleResponse(await this.findOrFail(id));
  }

  public findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    return this.repository.findEffectiveForUser(userId);
  }

  public async grant(body: CreateResourceRoleDto): Promise<ResourceRoleResponseDto> {
    if (
      !body ||
      !Number.isSafeInteger(body.role_id) ||
      body.role_id < 1 ||
      !Number.isSafeInteger(body.resource_id) ||
      body.resource_id < 1
    ) {
      throw new AppError(400, "role_id and resource_id must be positive integers");
    }
    const [role, resource] = await Promise.all([
      this.rolesRepository.findById(body.role_id),
      this.resourcesRepository.findById(body.resource_id),
    ]);
    if (!role || role.status !== "active") {
      throw new AppError(404, "Role not found or inactive");
    }
    if (!resource || resource.status !== "active") {
      throw new AppError(404, "Resource not found or inactive");
    }

    const existing = await this.repository.findByRoleAndResource(body.role_id, body.resource_id);
    if (existing) {
      if (existing.status === "active") {
        throw new AppError(409, "Role already has this resource granted");
      }
      await this.repository.update(existing, { status: "active" });
      return toResourceRoleResponse(await this.reload(existing.id));
    }

    try {
      const grant = await this.repository.create({
        role_id: body.role_id,
        resource_id: body.resource_id,
        status: "active",
      });
      return toResourceRoleResponse(await this.reload(grant.id));
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new AppError(409, "Role already has this resource granted");
      }
      throw error;
    }
  }

  public async deactivate(id: number): Promise<ResourceRoleResponseDto> {
    const grant = await this.findOrFail(id);
    await this.repository.update(grant, { status: "inactive" });
    return toResourceRoleResponse(await this.reload(grant.id));
  }

  public async reactivate(id: number): Promise<ResourceRoleResponseDto> {
    const grant = await this.findOrFail(id, false);
    if (grant.status === "active") {
      throw new AppError(409, "Grant is already active");
    }
    const [role, resource] = await Promise.all([
      this.rolesRepository.findById(grant.role_id),
      this.resourcesRepository.findById(grant.resource_id),
    ]);
    if (!role || role.status !== "active" || !resource || resource.status !== "active") {
      throw new AppError(404, "Role or resource not found or inactive");
    }
    await this.repository.update(grant, { status: "active" });
    return toResourceRoleResponse(await this.reload(grant.id));
  }

  public async reconcileRole(roleId: number, resourceIds: number[]): Promise<ReconcileResult> {
    if (!Number.isSafeInteger(roleId) || roleId < 1 || !Array.isArray(resourceIds)) {
      throw new AppError(400, "roleId and resourceIds are invalid");
    }
    const wanted = new Set<number>();
    for (const resourceId of resourceIds) {
      if (!Number.isSafeInteger(resourceId) || resourceId < 1) {
        throw new AppError(400, "resourceIds must contain positive integers");
      }
      wanted.add(resourceId);
    }
    const role = await this.rolesRepository.findById(roleId);
    if (!role || role.status !== "active") {
      throw new AppError(404, "Role not found or inactive");
    }
    const resources = await Promise.all(
      [...wanted].map((resourceId) => this.resourcesRepository.findById(resourceId))
    );
    if (resources.some((resource) => !resource || resource.status !== "active")) {
      throw new AppError(404, "One or more resources were not found or are inactive");
    }

    return withTransaction(async (transaction) => {
      const existing = await this.repository.findAllByRole(roleId, transaction);
      const byResource = new Map(existing.map((grant) => [grant.resource_id, grant]));
      let activated = 0;
      let deactivated = 0;

      for (const resourceId of wanted) {
        const previous = byResource.get(resourceId);
        if (!previous) {
          await this.repository.create(
            { role_id: roleId, resource_id: resourceId, status: "active" },
            transaction
          );
          activated++;
        } else if (previous.status !== "active") {
          await this.repository.update(previous, { status: "active" }, transaction);
          activated++;
        }
      }
      for (const previous of existing) {
        if (!wanted.has(previous.resource_id) && previous.status === "active") {
          await this.repository.update(previous, { status: "inactive" }, transaction);
          deactivated++;
        }
      }
      return {
        role_id: roleId,
        activated,
        deactivated,
        total_active: wanted.size,
      };
    });
  }

  private async findOrFail(id: number, onlyActive = true): Promise<ResourceRole> {
    const grant = await this.repository.findById(id);
    if (!grant || (onlyActive && grant.status !== "active")) {
      throw new AppError(404, "Grant not found");
    }
    return grant;
  }

  private async reload(id: number): Promise<ResourceRole> {
    const grant = await this.repository.findById(id);
    if (!grant) {
      throw new AppError(404, "Grant not found");
    }
    return grant;
  }
}
