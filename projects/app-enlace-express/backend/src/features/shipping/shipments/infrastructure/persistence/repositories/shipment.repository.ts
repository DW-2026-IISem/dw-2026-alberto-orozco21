import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Shipment } from '../../../domain/entities/shipment.entity.js';
import {
  ShipmentFindAllParams,
  IShipmentRepository,
} from '../../../domain/interfaces/shipment-repository.interface.js';
import { ShipmentMapper } from '../../../application/mappers/shipment.mapper.js';
import { ShipmentModel } from '../models/shipment.model.js';

@Injectable()
export class ShipmentRepository implements IShipmentRepository {
  async create(shipment: Shipment): Promise<Shipment> {
    const model = await ShipmentModel.create(
      ShipmentMapper.toPersistence(shipment),
    );
    return ShipmentMapper.toDomain(model);
  }

  async update(shipment: Shipment): Promise<Shipment> {
    await ShipmentModel.update(ShipmentMapper.toPersistence(shipment), {
      where: { id: shipment.id },
    });
    const updated = await ShipmentModel.findByPk(shipment.id!);
    return ShipmentMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ShipmentModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Shipment | null> {
    const model = await ShipmentModel.findByPk(id);
    return model ? ShipmentMapper.toDomain(model) : null;
  }

  async findAll(params: ShipmentFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};

    if (params.companyId) where.companyId = params.companyId;
    if (params.courierId) where.courierId = params.courierId;
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;

    if (params.search) {
      where[Op.or as unknown as string] = [
        { guideNumber: { [Op.like]: `%${params.search}%` } },
      ];
    }

    const { rows, count } = await ShipmentModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ShipmentMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
