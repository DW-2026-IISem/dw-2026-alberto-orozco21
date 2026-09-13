import { Inject, Injectable } from '@nestjs/common';
import { CourierDocumentAlreadyExistsException } from '../../domain/exceptions/courier-document-already-exists.exception.js';
import { Courier } from '../../domain/entities/courier.entity.js';
import {
  COURIER_REPOSITORY,
  type ICourierRepository,
} from '../../domain/interfaces/courier-repository.interface.js';
import { CreateCourierDto } from '../dto/create-courier.dto.js';
import { CourierMapper } from '../mappers/courier.mapper.js';

@Injectable()
export class CreateCourierUseCase {
  constructor(
    @Inject(COURIER_REPOSITORY)
    private readonly courierRepository: ICourierRepository,
  ) {}

  async execute(dto: CreateCourierDto) {
    const existing = await this.courierRepository.findByDocumentId(
      dto.documentId,
    );
    if (existing) {
      throw new CourierDocumentAlreadyExistsException(dto.documentId);
    }

    const courier = Courier.create({
      name: dto.name,
      documentId: dto.documentId,
      phone: dto.phone,
      vehicleType: dto.vehicleType,
      licensePlate: dto.licensePlate,
      assignedZone: dto.assignedZone,
    });

    const created = await this.courierRepository.create(courier);
    return CourierMapper.toResponse(created);
  }
}
