import { Inject, Injectable } from '@nestjs/common';
import { Rate } from '../../domain/entities/rate.entity.js';
import {
  RATE_REPOSITORY,
  type IRateRepository,
} from '../../domain/interfaces/rate-repository.interface.js';
import { CreateRateDto } from '../dto/create-rate.dto.js';
import { RateMapper } from '../mappers/rate.mapper.js';

@Injectable()
export class CreateRateUseCase {
  constructor(
    @Inject(RATE_REPOSITORY)
    private readonly rateRepository: IRateRepository,
  ) {}

  async execute(dto: CreateRateDto) {
    const rate = Rate.create({
      name: dto.name,
      zone: dto.zone,
      calculationRule: dto.calculationRule,
      baseValue: dto.baseValue,
      additionalValuePerKg: dto.additionalValuePerKg,
      urgentSurchargePct: dto.urgentSurchargePct,
      validFrom: new Date(dto.validFrom),
      validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
    });

    const created = await this.rateRepository.create(rate);
    return RateMapper.toResponse(created);
  }
}
