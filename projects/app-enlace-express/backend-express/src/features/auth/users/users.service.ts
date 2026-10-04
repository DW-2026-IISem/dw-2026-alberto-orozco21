import { UniqueConstraintError, ValidationError } from "sequelize";
import { comparePassword } from "../../../shared/auth/password";
import { AppError } from "../../../shared/errors/app-error";
import {
  ChangePasswordDto,
  CreateUserDto,
  PatchUserDto,
  UpdateUserDto,
  UserResponseDto,
  toUserResponse,
} from "./dto";
import { User } from "./user.model";
import { UsersRepository } from "./users.repository";
import { EffectivePermissionDto } from "../resource-roles/dto";
import { ResourceRolesService } from "../resource-roles/resource-roles.service";

export class UsersService {
  public constructor(
    private readonly repository: UsersRepository = new UsersRepository(),
    private readonly resourceRolesService: ResourceRolesService = new ResourceRolesService()
  ) {}

  public async getAll(): Promise<UserResponseDto[]> {
    return (await this.repository.findAllActive()).map(toUserResponse);
  }

  public async getOne(id: number): Promise<UserResponseDto> {
    return toUserResponse(await this.findOrFail(id));
  }

  public async getEffectivePermissions(id: number): Promise<EffectivePermissionDto[]> {
    await this.findOrFail(id);
    return this.resourceRolesService.findEffectiveForUser(id);
  }

  public async create(body: CreateUserDto): Promise<UserResponseDto> {
    this.validateCreate(body);
    await this.assertUnique(body.username, body.email);

    try {
      const user = await this.repository.create({
        username: body.username,
        email: body.email,
        password: body.password,
        avatar: body.avatar ?? null,
        status: body.status ?? "active",
      });
      return toUserResponse(user);
    } catch (error) {
      this.mapPersistenceError(error);
    }
  }

  public async updatePut(id: number, body: UpdateUserDto): Promise<UserResponseDto> {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new AppError(400, "A JSON object is required");
    }
    this.validateIdentity(body.username, body.email);
    this.validateAvatar(body.avatar);
    const user = await this.findOrFail(id);
    await this.assertUnique(body.username, body.email, id);

    try {
      await this.repository.update(user, {
        username: body.username,
        email: body.email,
        avatar: body.avatar ?? null,
      });
      return toUserResponse(user);
    } catch (error) {
      this.mapPersistenceError(error);
    }
  }

  public async updatePatch(id: number, body: PatchUserDto): Promise<UserResponseDto> {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new AppError(400, "A JSON object is required");
    }
    const user = await this.findOrFail(id);
    const changes: Partial<Pick<User, "username" | "email" | "avatar">> = {};

    if (body.username !== undefined) {
      this.validateUsername(body.username);
      changes.username = body.username;
    }
    if (body.email !== undefined) {
      this.validateEmail(body.email);
      changes.email = body.email;
    }
    if (Object.prototype.hasOwnProperty.call(body, "avatar")) {
      this.validateAvatar(body.avatar);
      changes.avatar = body.avatar ?? null;
    }
    if (Object.keys(changes).length === 0) {
      throw new AppError(400, "At least one editable field is required");
    }

    await this.assertUnique(changes.username ?? user.username, changes.email ?? user.email, id);
    try {
      await this.repository.update(user, changes);
      return toUserResponse(user);
    } catch (error) {
      this.mapPersistenceError(error);
    }
  }

  public async changePassword(id: number, body: ChangePasswordDto): Promise<void> {
    if (
      !body ||
      typeof body.current_password !== "string" ||
      typeof body.new_password !== "string" ||
      !body.current_password ||
      !body.new_password
    ) {
      throw new AppError(400, "current_password and new_password are required");
    }
    if (body.new_password.length < 8) {
      throw new AppError(400, "new_password must contain at least 8 characters");
    }

    const user = await this.repository.findByIdWithPassword(id);
    if (!user || user.status !== "active") {
      throw new AppError(404, "User not found");
    }
    if (!(await comparePassword(body.current_password, user.password))) {
      throw new AppError(400, "Current password is incorrect");
    }
    await this.repository.update(user, { password: body.new_password });
  }

  public async deletePhysical(id: number): Promise<void> {
    await this.repository.delete(await this.findOrFail(id, false));
  }

  public async deleteLogical(id: number): Promise<UserResponseDto> {
    const user = await this.findOrFail(id);
    await this.repository.update(user, { status: "inactive" });
    return toUserResponse(user);
  }

  private async findOrFail(id: number, onlyActive = true): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user || (onlyActive && user.status !== "active")) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  private async assertUnique(username: string, email: string, excludeId?: number): Promise<void> {
    const conflicts = await this.repository.findConflicts(username, email);
    const conflict = conflicts.find((candidate) => candidate.id !== excludeId);
    if (!conflict) return;
    if (conflict.username === username.trim().toLowerCase()) {
      throw new AppError(409, "Username already in use");
    }
    throw new AppError(409, "Email already in use");
  }

  private validateCreate(body: CreateUserDto): void {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new AppError(400, "A JSON object is required");
    }
    this.validateIdentity(body.username, body.email);
    if (typeof body.password !== "string" || body.password.length < 8) {
      throw new AppError(400, "password must contain at least 8 characters");
    }
    this.validateAvatar(body.avatar);
    if (body.status !== undefined && body.status !== "active" && body.status !== "inactive") {
      throw new AppError(400, "status must be active or inactive");
    }
  }

  private validateIdentity(username: string, email: string): void {
    this.validateUsername(username);
    this.validateEmail(email);
  }

  private validateUsername(username: unknown): asserts username is string {
    if (typeof username !== "string" || username.trim().length < 3 || username.trim().length > 80) {
      throw new AppError(400, "username must contain between 3 and 80 characters");
    }
  }

  private validateEmail(email: unknown): asserts email is string {
    if (
      typeof email !== "string" ||
      email.length > 150 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      throw new AppError(400, "email must be a valid email address");
    }
  }

  private validateAvatar(avatar: unknown): void {
    if (
      avatar !== undefined &&
      avatar !== null &&
      (typeof avatar !== "string" || avatar.length > 500)
    ) {
      throw new AppError(400, "avatar must be a string of at most 500 characters or null");
    }
  }

  private mapPersistenceError(error: unknown): never {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(409, "Username or email already in use");
    }
    if (error instanceof ValidationError) {
      throw new AppError(400, error.errors.map(({ message }) => message).join(", "));
    }
    throw error;
  }
}
