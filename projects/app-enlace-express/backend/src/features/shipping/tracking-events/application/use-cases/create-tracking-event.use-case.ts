import { Inject, Injectable } from '@nestjs/common';
import { ShipmentNotFoundException } from '../../../shipments/domain/exceptions/shipment-not-found.exception.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../../shipments/domain/interfaces/shipment-repository.interface.js';
import { CourierNotFoundException } from '../../../couriers/domain/exceptions/courier-not-found.exception.js';
import {
  COURIER_REPOSITORY,
  type ICourierRepository,
} from '../../../couriers/domain/interfaces/courier-repository.interface.js';
import { TrackingEvent } from '../../domain/entities/tracking-event.entity.js';
import {
  TRACKING_EVENT_REPOSITORY,
  type ITrackingEventRepository,
} from '../../domain/interfaces/tracking-event-repository.interface.js';
import { CreateTrackingEventDto } from '../dto/create-tracking-event.dto.js';
import { TrackingEventMapper } from '../mappers/tracking-event.mapper.js';

@Injectable()
export class CreateTrackingEventUseCase {
  constructor(
    @Inject(TRACKING_EVENT_REPOSITORY)
    private readonly trackingEventRepository: ITrackingEventRepository,
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
    @Inject(COURIER_REPOSITORY)
    private readonly courierRepository: ICourierRepository,
  ) {}

  async execute(dto: CreateTrackingEventDto) {
    const shipment = await this.shipmentRepository.findById(dto.shipmentId);
    if (!shipment) throw new ShipmentNotFoundException(dto.shipmentId);

    if (dto.recordedByCourierId) {
      const courier = await this.courierRepository.findById(dto.recordedByCourierId);
      if (!courier) throw new CourierNotFoundException(dto.recordedByCourierId);
    }

    const event = TrackingEvent.create({
      shipmentId: dto.shipmentId,
      type: dto.type,
      eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
      location: dto.location,
      observations: dto.observations,
      severity: dto.severity,
      recordedByCourierId: dto.recordedByCourierId,
    });

    const created = await this.trackingEventRepository.create(event);
    return TrackingEventMapper.toResponse(created);
  }
}
