import { Inject, Injectable } from '@nestjs/common';
import {
  PACKAGE_REPOSITORY,
  type IPackageRepository,
} from '../../domain/interfaces/package-repository.interface.js';
import { PackageFilterDto } from '../dto/package-filter.dto.js';
import { PackageMapper } from '../mappers/package.mapper.js';

@Injectable()
export class ListPackagesUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
  ) {}

  async execute(filter: PackageFilterDto) {
    const result = await this.packageRepository.findAll(filter);
    return {
      items: result.items.map((pkg) => PackageMapper.toResponse(pkg)),
      meta: result.meta,
    };
  }
}
