import { Inject, Injectable } from '@nestjs/common';
import { ShipmentNotFoundException } from '../../domain/exceptions/shipment-not-found.exception.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../domain/interfaces/shipment-repository.interface.js';
import { ShipmentMapper } from '../mappers/shipment.mapper.js';

@Injectable()
export class DeliverShipmentUseCase {
  // TODO(fase PruebaEntrega): inyectar PROOF_OF_DELIVERY_REPOSITORY y exigir
  // que exista una prueba de entrega válida antes de llamar shipment.deliver().
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
  ) {}

  async execute(id: number) {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) throw new ShipmentNotFoundException(id);

    shipment.deliver();

    const updated = await this.shipmentRepository.update(shipment);
    return ShipmentMapper.toResponse(updated);
  }
}
