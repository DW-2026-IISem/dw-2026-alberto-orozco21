import { UniqueConstraintError, ValidationError } from "sequelize";
import { AppError } from "../../../shared/errors/app-error";
import { normalizePath } from "../../../shared/auth/resource-match";
import {
  CreateResourceDto,
  PatchResourceDto,
  ResourceMethod,
  ResourceResponseDto,
  toResourceResponse,
  UpdateResourceDto,
} from "./dto";
import { Resource } from "./resource.model";
import { ResourcesRepository } from "./resources.repository";

const METHODS: readonly ResourceMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function isResourceMethod(method: string): method is ResourceMethod {
  return METHODS.some((allowedMethod) => allowedMethod === method);
}

export class ResourcesService {
  public constructor(
    private readonly repository: ResourcesRepository = new ResourcesRepository()
  ) {}

  public async getAll(): Promise<ResourceResponseDto[]> {
    return (await this.repository.findAllActive()).map(toResourceResponse);
  }

  public async getOne(id: number): Promise<ResourceResponseDto> {
    return toResourceResponse(await this.findOrFail(id));
  }

  public async create(body: CreateResourceDto): Promise<ResourceResponseDto> {
    this.validateObject(body);
    const operation = this.normalizeOperation(body.method, body.path);
    this.validateDescription(body.description);
    this.validateStatus(body.status);
    await this.assertOperationAvailable(operation.method, operation.path);
    try {
      const resource = await this.repository.create({
        method: operation.method,
        path: operation.path,
        description: body.description ?? null,
        status: body.status ?? "active",
      });
      return toResourceResponse(resource);
    } catch (error) {
      this.mapPersistenceError(error);
    }
  }

  public async updatePut(id: number, body: UpdateResourceDto): Promise<ResourceResponseDto> {
    this.validateObject(body);
    const operation = this.normalizeOperation(body.method, body.path);
    this.validateDescription(body.description);
    const resource = await this.findOrFail(id);
    await this.assertOperationAvailable(operation.method, operation.path, id);
    try {
      await this.repository.update(resource, {
        method: operation.method,
        path: operation.path,
        description: body.description ?? null,
      });
      return toResourceResponse(resource);
    } catch (error) {
      this.mapPersistenceError(error);
    }
  }

  public async updatePatch(id: number, body: PatchResourceDto): Promise<ResourceResponseDto> {
    this.validateObject(body);
    const resource = await this.findOrFail(id);
    const changes: Partial<Pick<Resource, "method" | "path" | "description">> = {};
    if (body.method !== undefined || body.path !== undefined) {
      const operation = this.normalizeOperation(
        body.method === undefined ? resource.method : body.method,
        body.path === undefined ? resource.path : body.path
      );
      changes.method = operation.method;
      changes.path = operation.path;
      await this.assertOperationAvailable(operation.method, operation.path, id);
    }
    if (Object.prototype.hasOwnProperty.call(body, "description")) {
      this.validateDescription(body.description);
      changes.description = body.description ?? null;
    }
    if (Object.keys(changes).length === 0) {
      throw new AppError(400, "At least one editable field is required");
    }
    try {
      await this.repository.update(resource, changes);
      return toResourceResponse(resource);
    } catch (error) {
      this.mapPersistenceError(error);
    }
  }

  public async deletePhysical(id: number): Promise<void> {
    await this.repository.delete(await this.findOrFail(id, false));
  }

  public async deleteLogical(id: number): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);
    await this.repository.update(resource, { status: "inactive" });
    return toResourceResponse(resource);
  }

  private async findOrFail(id: number, onlyActive = true): Promise<Resource> {
    const resource = await this.repository.findById(id);
    if (!resource || (onlyActive && resource.status !== "active")) {
      throw new AppError(404, "Resource not found");
    }
    return resource;
  }

  private async assertOperationAvailable(
    method: string,
    path: string,
    excludeId?: number
  ): Promise<void> {
    const existing = await this.repository.findByOperation(method, path);
    if (existing && existing.id !== excludeId) {
      throw new AppError(409, `Resource ${method.toUpperCase()} ${normalizePath(path)} already exists`);
    }
  }

  private validateObject(body: unknown): asserts body is Record<string, unknown> {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new AppError(400, "A JSON object is required");
    }
  }

  private normalizeOperation(method: unknown, path: unknown): {
    method: ResourceMethod;
    path: string;
  } {
    if (typeof method !== "string") {
      throw new AppError(400, "method must be GET, POST, PUT, PATCH, or DELETE");
    }
    const normalizedMethod = method.trim().toUpperCase();
    if (!isResourceMethod(normalizedMethod)) {
      throw new AppError(400, "method must be GET, POST, PUT, PATCH, or DELETE");
    }
    if (
      typeof path !== "string" ||
      !path.trim().startsWith("/") ||
      path.trim().length > 255 ||
      /[?#\s\\\u0000-\u001f]/.test(path) ||
      path.trim().includes("//") ||
      (path.trim().length === 1 && path.trim() !== "/")
    ) {
      throw new AppError(400, "path must be a valid absolute route pattern of at most 255 characters");
    }
    return {
      method: normalizedMethod,
      path: normalizePath(path.trim()),
    };
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
      throw new AppError(409, "Resource method and path already exist");
    }
    if (error instanceof ValidationError) {
      throw new AppError(400, error.errors.map(({ message }) => message).join(", "));
    }
    throw error;
  }
}
