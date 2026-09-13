import { Inject, Injectable } from '@nestjs/common';
import {
  RATE_REPOSITORY,
  type IRateRepository,
} from '../../domain/interfaces/rate-repository.interface.js';
import { RateFilterDto } from '../dto/rate-filter.dto.js';
import { RateMapper } from '../mappers/rate.mapper.js';

@Injectable()
export class ListRatesUseCase {
  constructor(
    @Inject(RATE_REPOSITORY)
    private readonly rateRepository: IRateRepository,
  ) {}

  async execute(filter: RateFilterDto) {
    const result = await this.rateRepository.findAll(filter);
    return {
      items: result.items.map((rate) => RateMapper.toResponse(rate)),
      meta: result.meta,
    };
  }
}
