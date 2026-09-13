import { Inject, Injectable } from '@nestjs/common';
import { RateNotFoundException } from '../../domain/exceptions/rate-not-found.exception.js';
import {
  RATE_REPOSITORY,
  type IRateRepository,
} from '../../domain/interfaces/rate-repository.interface.js';
import { RateMapper } from '../mappers/rate.mapper.js';

@Injectable()
export class GetRateUseCase {
  constructor(
    @Inject(RATE_REPOSITORY)
    private readonly rateRepository: IRateRepository,
  ) {}

  async execute(id: number) {
    const rate = await this.rateRepository.findById(id);
    if (!rate) {
      throw new RateNotFoundException(id);
    }

    return RateMapper.toResponse(rate);
  }
}
