import { Inject, Injectable } from '@nestjs/common';
import { CourierNotFoundException } from '../../../couriers/domain/exceptions/courier-not-found.exception.js';
import {
  COURIER_REPOSITORY,
  type ICourierRepository,
} from '../../../couriers/domain/interfaces/courier-repository.interface.js';
import { RouteNotFoundException } from '../../../routes/domain/exceptions/route-not-found.exception.js';
import {
  ROUTE_REPOSITORY,
  type IRouteRepository,
} from '../../../routes/domain/interfaces/route-repository.interface.js';
import { ShipmentNotFoundException } from '../../domain/exceptions/shipment-not-found.exception.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../domain/interfaces/shipment-repository.interface.js';
import { AssignShipmentDto } from '../dto/assign-shipment.dto.js';
import { ShipmentMapper } from '../mappers/shipment.mapper.js';

@Injectable()
export class AssignShipmentUseCase {
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
    @Inject(COURIER_REPOSITORY)
    private readonly courierRepository: ICourierRepository,
    @Inject(ROUTE_REPOSITORY)
    private readonly routeRepository: IRouteRepository,
  ) {}

  async execute(id: number, dto: AssignShipmentDto) {
    const shipment = await this.shipmentRepository.findById(id);
    if (!shipment) throw new ShipmentNotFoundException(id);

    const courier = await this.courierRepository.findById(dto.courierId);
    if (!courier) throw new CourierNotFoundException(dto.courierId);

    const route = await this.routeRepository.findById(dto.routeId);
    if (!route) throw new RouteNotFoundException(dto.routeId);

    if (route.courierId !== dto.courierId) {
      throw new Error('La ruta no pertenece al mensajero indicado');
    }

    shipment.assign(dto.courierId, dto.routeId);

    const updated = await this.shipmentRepository.update(shipment);
    return ShipmentMapper.toResponse(updated);
  }
}
