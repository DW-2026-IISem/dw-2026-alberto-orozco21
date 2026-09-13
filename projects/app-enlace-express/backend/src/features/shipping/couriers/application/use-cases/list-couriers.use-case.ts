import { Inject, Injectable } from '@nestjs/common';
import {
  COURIER_REPOSITORY,
  type ICourierRepository,
} from '../../domain/interfaces/courier-repository.interface.js';
import { CourierFilterDto } from '../dto/courier-filter.dto.js';
import { CourierMapper } from '../mappers/courier.mapper.js';

@Injectable()
export class ListCouriersUseCase {
  constructor(
    @Inject(COURIER_REPOSITORY)
    private readonly courierRepository: ICourierRepository,
  ) {}

  async execute(filter: CourierFilterDto) {
    const result = await this.courierRepository.findAll(filter);
    return {
      items: result.items.map((courier) => CourierMapper.toResponse(courier)),
      meta: result.meta,
    };
  }
}
