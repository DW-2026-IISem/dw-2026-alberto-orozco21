import { Inject, Injectable } from '@nestjs/common';
import { CourierNotFoundException } from '../../../couriers/domain/exceptions/courier-not-found.exception.js';
import {
  COURIER_REPOSITORY,
  type ICourierRepository,
} from '../../../couriers/domain/interfaces/courier-repository.interface.js';
import { Route } from '../../domain/entities/route.entity.js';
import {
  ROUTE_REPOSITORY,
  type IRouteRepository,
} from '../../domain/interfaces/route-repository.interface.js';
import { CreateRouteDto } from '../dto/create-route.dto.js';
import { RouteMapper } from '../mappers/route.mapper.js';

@Injectable()
export class CreateRouteUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: IRouteRepository,
    @Inject(COURIER_REPOSITORY)
    private readonly courierRepository: ICourierRepository,
  ) {}

  async execute(dto: CreateRouteDto) {
    const courier = await this.courierRepository.findById(dto.courierId);
    if (!courier) {
      throw new CourierNotFoundException(dto.courierId);
    }

    const route = Route.create({
      courierId: dto.courierId,
      name: dto.name,
      coverageZone: dto.coverageZone,
      date: new Date(dto.date),
      startTime: new Date(dto.startTime),
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      status: dto.status,
    });

    const created = await this.routeRepository.create(route);
    return RouteMapper.toResponse(created);
  }
}
