import { Inject, Injectable } from '@nestjs/common';
import { RouteNotFoundException } from '../../domain/exceptions/route-not-found.exception.js';
import {
  ROUTE_REPOSITORY,
  type IRouteRepository,
} from '../../domain/interfaces/route-repository.interface.js';
import { RouteMapper } from '../mappers/route.mapper.js';

@Injectable()
export class GetRouteUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: IRouteRepository,
  ) {}

  async execute(id: number) {
    const route = await this.routeRepository.findById(id);
    if (!route) {
      throw new RouteNotFoundException(id);
    }

    return RouteMapper.toResponse(route);
  }
}
