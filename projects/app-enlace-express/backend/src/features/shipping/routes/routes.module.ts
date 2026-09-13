import { Module } from '@nestjs/common';
import { CouriersModule } from '../couriers/couriers.module.js';
import { ROUTE_REPOSITORY } from './domain/interfaces/route-repository.interface.js';
import { RouteRepository } from './infrastructure/persistence/repositories/route.repository.js';
import { CreateRouteUseCase } from './application/use-cases/create-route.use-case.js';
import { UpdateRouteUseCase } from './application/use-cases/update-route.use-case.js';
import { DeleteRouteUseCase } from './application/use-cases/delete-route.use-case.js';
import { GetRouteUseCase } from './application/use-cases/get-route.use-case.js';
import { ListRoutesUseCase } from './application/use-cases/list-routes.use-case.js';
import { RoutesController } from './presentation/http/controllers/routes.controller.js';

@Module({
  imports: [CouriersModule],
  controllers: [RoutesController],
  providers: [
    RouteRepository,
    { provide: ROUTE_REPOSITORY, useExisting: RouteRepository },
    CreateRouteUseCase,
    UpdateRouteUseCase,
    DeleteRouteUseCase,
    GetRouteUseCase,
    ListRoutesUseCase,
  ],
  exports: [ROUTE_REPOSITORY],
})
export class RoutesModule {}
