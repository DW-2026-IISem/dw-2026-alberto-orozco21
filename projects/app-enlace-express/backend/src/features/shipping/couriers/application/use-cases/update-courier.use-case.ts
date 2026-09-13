import { Inject, Injectable } from '@nestjs/common';
import { CourierNotFoundException } from '../../domain/exceptions/courier-not-found.exception.js';
import {
  COURIER_REPOSITORY,
  type ICourierRepository,
} from '../../domain/interfaces/courier-repository.interface.js';
import { UpdateCourierDto } from '../dto/update-courier.dto.js';
import { CourierMapper } from '../mappers/courier.mapper.js';

@Injectable()
export class UpdateCourierUseCase {
  constructor(
    @Inject(COURIER_REPOSITORY)
    private readonly courierRepository: ICourierRepository,
  ) {}

  async execute(id: number, dto: UpdateCourierDto) {
    const courier = await this.courierRepository.findById(id);
    if (!courier) {
      throw new CourierNotFoundException(id);
    }

    courier.update(dto);
    const updated = await this.courierRepository.update(courier);
    return CourierMapper.toResponse(updated);
  }
}
