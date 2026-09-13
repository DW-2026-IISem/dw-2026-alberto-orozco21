import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Route } from '../../../domain/entities/route.entity.js';
import {
  RouteFindAllParams,
  IRouteRepository,
} from '../../../domain/interfaces/route-repository.interface.js';
import { RouteMapper } from '../../../application/mappers/route.mapper.js';
import { RouteModel } from '../models/route.model.js';

@Injectable()
export class RouteRepository implements IRouteRepository {
  async create(route: Route): Promise<Route> {
    const model = await RouteModel.create(RouteMapper.toPersistence(route));
    return RouteMapper.toDomain(model);
  }

  async update(route: Route): Promise<Route> {
    await RouteModel.update(RouteMapper.toPersistence(route), {
      where: { id: route.id },
    });
    const updated = await RouteModel.findByPk(route.id!);
    return RouteMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await RouteModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Route | null> {
    const model = await RouteModel.findByPk(id);
    return model ? RouteMapper.toDomain(model) : null;
  }

  async findAll(params: RouteFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};

    if (params.courierId) {
      where.courierId = params.courierId;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where[Op.or as unknown as string] = [
        { name: { [Op.like]: `%${params.search}%` } },
        { coverageZone: { [Op.like]: `%${params.search}%` } },
      ];
    }

    const { rows, count } = await RouteModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['date', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => RouteMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
