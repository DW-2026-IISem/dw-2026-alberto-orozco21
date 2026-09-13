import { Inject, Injectable } from '@nestjs/common';
import { CourierNotFoundException } from '../../domain/exceptions/courier-not-found.exception.js';
import {
  COURIER_REPOSITORY,
  type ICourierRepository,
} from '../../domain/interfaces/courier-repository.interface.js';

@Injectable()
export class DeleteCourierUseCase {
  constructor(
    @Inject(COURIER_REPOSITORY)
    private readonly courierRepository: ICourierRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const courier = await this.courierRepository.findById(id);
    if (!courier) {
      throw new CourierNotFoundException(id);
    }

    await this.courierRepository.delete(id);
  }
}
