import { Module } from '@nestjs/common';
import { ShipmentsModule } from '../shipments/shipments.module.js';
import { PACKAGE_REPOSITORY } from './domain/interfaces/package-repository.interface.js';
import { PackageRepository } from './infrastructure/persistence/repositories/package.repository.js';
import { CreatePackageUseCase } from './application/use-cases/create-package.use-case.js';
import { UpdatePackageUseCase } from './application/use-cases/update-package.use-case.js';
import { DeletePackageUseCase } from './application/use-cases/delete-package.use-case.js';
import { GetPackageUseCase } from './application/use-cases/get-package.use-case.js';
import { ListPackagesUseCase } from './application/use-cases/list-packages.use-case.js';
import { PackagesController } from './presentation/http/controllers/packages.controller.js';

@Module({
  imports: [ShipmentsModule],
  controllers: [PackagesController],
  providers: [
    PackageRepository,
    { provide: PACKAGE_REPOSITORY, useExisting: PackageRepository },
    CreatePackageUseCase,
    UpdatePackageUseCase,
    DeletePackageUseCase,
    GetPackageUseCase,
    ListPackagesUseCase,
  ],
  exports: [PACKAGE_REPOSITORY],
})
export class PackagesModule {}
