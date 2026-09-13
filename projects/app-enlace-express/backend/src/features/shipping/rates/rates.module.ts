import { Module } from '@nestjs/common';
import { RATE_REPOSITORY } from './domain/interfaces/rate-repository.interface.js';
import { RateRepository } from './infrastructure/persistence/repositories/rate.repository.js';
import { CreateRateUseCase } from './application/use-cases/create-rate.use-case.js';
import { UpdateRateUseCase } from './application/use-cases/update-rate.use-case.js';
import { DeleteRateUseCase } from './application/use-cases/delete-rate.use-case.js';
import { GetRateUseCase } from './application/use-cases/get-rate.use-case.js';
import { ListRatesUseCase } from './application/use-cases/list-rates.use-case.js';
import { RatesController } from './presentation/http/controllers/rates.controller.js';

@Module({
  controllers: [RatesController],
  providers: [
    RateRepository,
    { provide: RATE_REPOSITORY, useExisting: RateRepository },
    CreateRateUseCase,
    UpdateRateUseCase,
    DeleteRateUseCase,
    GetRateUseCase,
    ListRatesUseCase,
  ],
  exports: [RATE_REPOSITORY],
})
export class RatesModule {}
