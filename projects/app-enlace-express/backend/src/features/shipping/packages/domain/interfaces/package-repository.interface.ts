import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Package } from '../entities/package.entity.js';

export const PACKAGE_REPOSITORY = 'PACKAGE_REPOSITORY';

export interface PackageFindAllParams {
  page?: number;
  limit?: number;
  shipmentId?: number;
}

export interface IPackageRepository {
  create(pkg: Package): Promise<Package>;
  update(pkg: Package): Promise<Package>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Package | null>;
  findAll(params: PackageFindAllParams): Promise<PaginatedResult<Package>>;
}
