import { Inject, Injectable } from '@nestjs/common';
import {
  ROUTE_REPOSITORY,
  type IRouteRepository,
} from '../../domain/interfaces/route-repository.interface.js';
import { RouteFilterDto } from '../dto/route-filter.dto.js';
import { RouteMapper } from '../mappers/route.mapper.js';

@Injectable()
export class ListRoutesUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: IRouteRepository,
  ) {}

  async execute(filter: RouteFilterDto) {
    const result = await this.routeRepository.findAll(filter);
    return {
      items: result.items.map((route) => RouteMapper.toResponse(route)),
      meta: result.meta,
    };
  }
}
