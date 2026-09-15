import { TrackingEvent } from '../../domain/entities/tracking-event.entity.js';
import { TrackingEventResponseDto } from '../dto/tracking-event-response.dto.js';
import { TrackingEventModel } from '../../infrastructure/persistence/models/tracking-event.model.js';

export class TrackingEventMapper {
  static toDomain(model: TrackingEventModel): TrackingEvent {
    return TrackingEvent.reconstitute({
      id: model.id,
      shipmentId: model.shipmentId,
      type: model.type,
      eventDate: model.eventDate,
      location: model.location ?? undefined,
      observations: model.observations ?? undefined,
      severity: model.severity,
      recordedByCourierId: model.recordedByCourierId ?? undefined,
      createdAt: model.createdAt,
    });
  }

  static toResponse(entity: TrackingEvent): TrackingEventResponseDto {
    return {
      id: entity.id!,
      shipmentId: entity.shipmentId,
      type: entity.type,
      eventDate: entity.eventDate,
      location: entity.location,
      observations: entity.observations,
      severity: entity.severity,
      recordedByCourierId: entity.recordedByCourierId,
      createdAt: entity.createdAt!,
    };
  }

  static toPersistence(entity: TrackingEvent): Partial<TrackingEventModel> {
    return {
      id: entity.id,
      shipmentId: entity.shipmentId,
      type: entity.type,
      eventDate: entity.eventDate,
      location: entity.location ?? null,
      observations: entity.observations ?? null,
      severity: entity.severity,
      recordedByCourierId: entity.recordedByCourierId ?? null,
    };
  }
}
