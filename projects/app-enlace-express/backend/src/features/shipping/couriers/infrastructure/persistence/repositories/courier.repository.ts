import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Courier } from '../../../domain/entities/courier.entity.js';
import {
  CourierFindAllParams,
  ICourierRepository,
} from '../../../domain/interfaces/courier-repository.interface.js';
import { CourierMapper } from '../../../application/mappers/courier.mapper.js';
import { CourierModel } from '../models/courier.model.js';

@Injectable()
export class CourierRepository implements ICourierRepository {
  async create(courier: Courier): Promise<Courier> {
    const model = await CourierModel.create(
      CourierMapper.toPersistence(courier),
    );
    return CourierMapper.toDomain(model);
  }

  async update(courier: Courier): Promise<Courier> {
    await CourierModel.update(CourierMapper.toPersistence(courier), {
      where: { id: courier.id },
    });
    const updated = await CourierModel.findByPk(courier.id!);
    return CourierMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await CourierModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Courier | null> {
    const model = await CourierModel.findByPk(id);
    return model ? CourierMapper.toDomain(model) : null;
  }

  async findByDocumentId(documentId: string): Promise<Courier | null> {
    const model = await CourierModel.findOne({ where: { documentId } });
    return model ? CourierMapper.toDomain(model) : null;
  }

  async findAll(params: CourierFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};

    if (params.vehicleType) {
      where.vehicleType = params.vehicleType;
    }

    if (params.assignedZone) {
      where.assignedZone = params.assignedZone;
    }

    if (params.search) {
      where[Op.or as unknown as string] = [
        { name: { [Op.like]: `%${params.search}%` } },
        { documentId: { [Op.like]: `%${params.search}%` } },
      ];
    }

    if (!params.includeInactive) {
      where.isActive = true;
    }

    const { rows, count } = await CourierModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => CourierMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
