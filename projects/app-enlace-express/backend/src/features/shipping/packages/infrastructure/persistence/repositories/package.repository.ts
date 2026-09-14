import { Injectable } from '@nestjs/common';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Package } from '../../../domain/entities/package.entity.js';
import {
  PackageFindAllParams,
  IPackageRepository,
} from '../../../domain/interfaces/package-repository.interface.js';
import { PackageMapper } from '../../../application/mappers/package.mapper.js';
import { PackageModel } from '../models/package.model.js';

@Injectable()
export class PackageRepository implements IPackageRepository {
  async create(pkg: Package): Promise<Package> {
    const model = await PackageModel.create(PackageMapper.toPersistence(pkg));
    return PackageMapper.toDomain(model);
  }

  async update(pkg: Package): Promise<Package> {
    await PackageModel.update(PackageMapper.toPersistence(pkg), {
      where: { id: pkg.id },
    });
    const updated = await PackageModel.findByPk(pkg.id!);
    return PackageMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await PackageModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Package | null> {
    const model = await PackageModel.findByPk(id);
    return model ? PackageMapper.toDomain(model) : null;
  }

  async findAll(params: PackageFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};
    if (params.shipmentId) {
      where.shipmentId = params.shipmentId;
    }

    const { rows, count } = await PackageModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => PackageMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
