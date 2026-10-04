import { UniqueConstraintError, ValidationError } from "sequelize";
import { AppError } from "../../../shared/errors/app-error";
import { CreateRoleDto, PatchRoleDto, RoleResponseDto, UpdateRoleDto, toRoleResponse } from "./dto";
import { Role } from "./role.model";
import { RolesRepository } from "./roles.repository";

export class RolesService {
  public constructor(private readonly repository: RolesRepository = new RolesRepository()) {}

  public async getAll(): Promise<RoleResponseDto[]> {
    return (await this.repository.findAllActive()).map(toRoleResponse);
  }

  public async getOne(id: number): Promise<RoleResponseDto> {
    return toRoleResponse(await this.findOrFail(id));
  }

  public async create(body: CreateRoleDto): Promise<RoleResponseDto> {
    this.validateObject(body);
    this.validateName(body.name);
    this.validateDescription(body.description);
    this.validateStatus(body.status);
    await this.assertNameAvailable(body.name);
    try {
      const role = await this.repository.create({
        name: body.name,
        description: body.description ?? null,
        status: body.status ?? "active",
      });
      return toRoleResponse(role);
    } catch (error) {
      this.mapPersistenceError(error);
    }
  }

  public async updatePut(id: number, body: UpdateRoleDto): Promise<RoleResponseDto> {
    this.validateObject(body);
    this.validateName(body.name);
    this.validateDescription(body.description);
    const role = await this.findOrFail(id);
    await this.assertNameAvailable(body.name, id);
    try {
      await this.repository.update(role, {
        name: body.name,
        description: body.description ?? null,
      });
      return toRoleResponse(role);
    } catch (error) {
      this.mapPersistenceError(error);
    }
  }

  public async updatePatch(id: number, body: PatchRoleDto): Promise<RoleResponseDto> {
    this.validateObject(body);
    const role = await this.findOrFail(id);
    const changes: Partial<Pick<Role, "name" | "description">> = {};
    if (body.name !== undefined) {
      this.validateName(body.name);
      changes.name = body.name;
    }
    if (Object.prototype.hasOwnProperty.call(body, "description")) {
      this.validateDescription(body.description);
      changes.description = body.description ?? null;
    }
    if (Object.keys(changes).length === 0) {
      throw new AppError(400, "At least one editable field is required");
    }
    if (changes.name) await this.assertNameAvailable(changes.name, id);
    try {
      await this.repository.update(role, changes);
      return toRoleResponse(role);
    } catch (error) {
      this.mapPersistenceError(error);
    }
  }

  public async deletePhysical(id: number): Promise<void> {
    await this.repository.delete(await this.findOrFail(id, false));
  }

  public async deleteLogical(id: number): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);
    await this.repository.update(role, { status: "inactive" });
    return toRoleResponse(role);
  }

  private async findOrFail(id: number, onlyActive = true): Promise<Role> {
    const role = await this.repository.findById(id);
    if (!role || (onlyActive && role.status !== "active")) {
      throw new AppError(404, "Role not found");
    }
    return role;
  }

  private async assertNameAvailable(name: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByName(name);
    if (existing && existing.id !== excludeId) {
      throw new AppError(409, "Role name already in use");
    }
  }

  private validateObject(body: unknown): asserts body is Record<string, unknown> {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new AppError(400, "A JSON object is required");
    }
  }

  private validateName(name: unknown): asserts name is string {
    if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
      throw new AppError(400, "name is required and must be at most 80 characters");
    }
  }

  private validateDescription(description: unknown): void {
    if (
      description !== undefined &&
      description !== null &&
      (typeof description !== "string" || description.length > 255)
    ) {
      throw new AppError(400, "description must be at most 255 characters or null");
    }
  }

  private validateStatus(status: unknown): void {
    if (status !== undefined && status !== "active" && status !== "inactive") {
      throw new AppError(400, "status must be active or inactive");
    }
  }

  private mapPersistenceError(error: unknown): never {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(409, "Role name already in use");
    }
    if (error instanceof ValidationError) {
      throw new AppError(400, error.errors.map(({ message }) => message).join(", "));
    }
    throw error;
  }
}
