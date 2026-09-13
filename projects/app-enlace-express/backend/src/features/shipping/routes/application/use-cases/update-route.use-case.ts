import { Inject, Injectable } from '@nestjs/common';
import { RouteNotFoundException } from '../../domain/exceptions/route-not-found.exception.js';
import {
  ROUTE_REPOSITORY,
  type IRouteRepository,
} from '../../domain/interfaces/route-repository.interface.js';
import { UpdateRouteDto } from '../dto/update-route.dto.js';
import { RouteMapper } from '../mappers/route.mapper.js';

@Injectable()
export class UpdateRouteUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: IRouteRepository,
  ) {}

  async execute(id: number, dto: UpdateRouteDto) {
    const route = await this.routeRepository.findById(id);
    if (!route) {
      throw new RouteNotFoundException(id);
    }

    route.update({
      name: dto.name,
      coverageZone: dto.coverageZone,
      date: dto.date ? new Date(dto.date) : undefined,
      startTime: dto.startTime ? new Date(dto.startTime) : undefined,
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
      status: dto.status,
    });

    const updated = await this.routeRepository.update(route);
    return RouteMapper.toResponse(updated);
  }
}
