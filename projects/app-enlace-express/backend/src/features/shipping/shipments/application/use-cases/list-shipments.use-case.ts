import { Inject, Injectable } from '@nestjs/common';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../domain/interfaces/shipment-repository.interface.js';
import { ShipmentFilterDto } from '../dto/shipment-filter.dto.js';
import { ShipmentMapper } from '../mappers/shipment.mapper.js';

@Injectable()
export class ListShipmentsUseCase {
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
  ) {}

  async execute(filter: ShipmentFilterDto) {
    const result = await this.shipmentRepository.findAll(filter);
    return {
      items: result.items.map((shipment) => ShipmentMapper.toResponse(shipment)),
      meta: result.meta,
    };
  }
}
