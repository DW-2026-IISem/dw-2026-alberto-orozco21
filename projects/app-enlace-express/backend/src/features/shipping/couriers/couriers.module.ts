import { Module } from '@nestjs/common';
import { COURIER_REPOSITORY } from './domain/interfaces/courier-repository.interface.js';
import { CourierRepository } from './infrastructure/persistence/repositories/courier.repository.js';
import { CreateCourierUseCase } from './application/use-cases/create-courier.use-case.js';
import { UpdateCourierUseCase } from './application/use-cases/update-courier.use-case.js';
import { DeleteCourierUseCase } from './application/use-cases/delete-courier.use-case.js';
import { GetCourierUseCase } from './application/use-cases/get-courier.use-case.js';
import { ListCouriersUseCase } from './application/use-cases/list-couriers.use-case.js';
import { CouriersController } from './presentation/http/controllers/couriers.controller.js';

@Module({
  controllers: [CouriersController],
  providers: [
    CourierRepository,
    { provide: COURIER_REPOSITORY, useExisting: CourierRepository },
    CreateCourierUseCase,
    UpdateCourierUseCase,
    DeleteCourierUseCase,
    GetCourierUseCase,
    ListCouriersUseCase,
  ],
  exports: [COURIER_REPOSITORY],
})
export class CouriersModule {}
