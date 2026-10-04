import { EffectivePermissionDto } from "./dto";
import { ResourceRolesRepository } from "./resource-roles.repository";

export class ResourceRolesService {
  public constructor(
    private readonly repository: ResourceRolesRepository = new ResourceRolesRepository()
  ) {}

  public findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    return this.repository.findEffectiveForUser(userId);
  }
}
