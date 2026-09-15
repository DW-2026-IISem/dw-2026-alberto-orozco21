import { TrackingEvent } from '../../../domain/entities/tracking-event.entity.js';
import { TrackingEventResponseDto } from '../../../application/dto/tracking-event-response.dto.js';
import { TrackingEventMapper } from '../../../application/mappers/tracking-event.mapper.js';

export class TrackingEventSerializer {
  static serialize(entity: TrackingEvent): TrackingEventResponseDto {
    return TrackingEventMapper.toResponse(entity);
  }
}
