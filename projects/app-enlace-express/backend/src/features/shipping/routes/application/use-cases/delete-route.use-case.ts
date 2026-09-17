import { Inject, Injectable } from '@nestjs/common';
import { RouteNotFoundException } from '../../domain/exceptions/route-not-found.exception.js';
import {
  ROUTE_REPOSITORY,
  type IRouteRepository,
} from '../../domain/interfaces/route-repository.interface.js';

@Injectable()
export class DeleteRouteUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: IRouteRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const route = await this.routeRepository.findById(id);
    if (!route) {
      throw new RouteNotFoundException(id);
    }

    route.deactivate();
    await this.routeRepository.update(route);
  }
}
