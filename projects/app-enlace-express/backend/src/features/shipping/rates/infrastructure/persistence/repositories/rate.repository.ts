import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Rate } from '../../../domain/entities/rate.entity.js';
import {
  RateFindAllParams,
  IRateRepository,
} from '../../../domain/interfaces/rate-repository.interface.js';
import { RateMapper } from '../../../application/mappers/rate.mapper.js';
import { RateModel } from '../models/rate.model.js';

@Injectable()
export class RateRepository implements IRateRepository {
  async create(rate: Rate): Promise<Rate> {
    const model = await RateModel.create(RateMapper.toPersistence(rate));
    return RateMapper.toDomain(model);
  }

  async update(rate: Rate): Promise<Rate> {
    await RateModel.update(RateMapper.toPersistence(rate), {
      where: { id: rate.id },
    });
    const updated = await RateModel.findByPk(rate.id!);
    return RateMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await RateModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Rate | null> {
    const model = await RateModel.findByPk(id);
    return model ? RateMapper.toDomain(model) : null;
  }

  async findAll(params: RateFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};

    if (params.calculationRule) {
      where.calculationRule = params.calculationRule;
    }

    if (params.zone) {
      where.zone = params.zone;
    }

    if (params.search) {
      where[Op.or as unknown as string] = [
        { name: { [Op.like]: `%${params.search}%` } },
        { zone: { [Op.like]: `%${params.search}%` } },
      ];
    }

    const { rows, count } = await RateModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => RateMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }

  async findCurrentByZone(zone: string, date: Date = new Date()): Promise<Rate | null> {
    const isoDate = date.toISOString().slice(0, 10);

    const model = await RateModel.findOne({
      where: {
        zone,
        isActive: true,
        validFrom: { [Op.lte]: isoDate },
        [Op.or]: [{ validUntil: null }, { validUntil: { [Op.gte]: isoDate } }],
      },
      order: [['validFrom', 'DESC']],
    });

    return model ? RateMapper.toDomain(model) : null;
  }
}
