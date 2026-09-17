import { Inject, Injectable } from '@nestjs/common';
import { ShipmentStatus } from '../../domain/enums/shipment-status.enum.js';
import { ShipmentNotFoundException } from '../../domain/exceptions/shipment-not-found.exception.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../domain/interfaces/shipment-repository.interface.js';

@Injectable()
export class DeleteShipmentUseCase {
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) throw new ShipmentNotFoundException(id);

    if (shipment.status !== ShipmentStatus.CREATED) {
      throw new Error(
        `No se puede eliminar un envío en estado '${shipment.status}'; use cancelar en su lugar`,
      );
    }

    shipment.deactivate();
    await this.shipmentRepository.update(shipment);
  }
}
