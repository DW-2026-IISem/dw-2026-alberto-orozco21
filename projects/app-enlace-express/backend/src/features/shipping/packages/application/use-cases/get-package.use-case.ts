import { Inject, Injectable } from '@nestjs/common';
import { PackageNotFoundException } from '../../domain/exceptions/package-not-found.exception.js';
import {
  PACKAGE_REPOSITORY,
  type IPackageRepository,
} from '../../domain/interfaces/package-repository.interface.js';
import { PackageMapper } from '../mappers/package.mapper.js';

@Injectable()
export class GetPackageUseCase {
  constructor(
    @Inject(PACKAGE_REPOSITORY)
    private readonly packageRepository: IPackageRepository,
  ) {}

  async execute(id: number) {
    const pkg = await this.packageRepository.findById(id);
    if (!pkg) throw new PackageNotFoundException(id);
    return PackageMapper.toResponse(pkg);
  }
}
