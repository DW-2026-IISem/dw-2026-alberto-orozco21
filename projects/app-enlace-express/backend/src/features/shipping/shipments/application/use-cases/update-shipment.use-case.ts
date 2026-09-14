import { Inject, Injectable } from '@nestjs/common';
import { ShipmentNotFoundException } from '../../domain/exceptions/shipment-not-found.exception.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../domain/interfaces/shipment-repository.interface.js';
import { UpdateShipmentDto } from '../dto/update-shipment.dto.js';
import { ShipmentMapper } from '../mappers/shipment.mapper.js';

@Injectable()
export class UpdateShipmentUseCase {
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
  ) {}

  async execute(id: number, dto: UpdateShipmentDto) {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) throw new ShipmentNotFoundException(id);

    shipment.update({
      priority: dto.priority,
      totalWeightKg: dto.totalWeightKg,
      declaredValue: dto.declaredValue,
      estimatedDeliveryDate: dto.estimatedDeliveryDate
        ? new Date(dto.estimatedDeliveryDate)
        : undefined,
    });

    const updated = await this.shipmentRepository.update(shipment);
    return ShipmentMapper.toResponse(updated);
  }
}
