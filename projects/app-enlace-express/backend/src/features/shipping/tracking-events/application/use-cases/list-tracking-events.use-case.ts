import { Inject, Injectable } from '@nestjs/common';
import {
  TRACKING_EVENT_REPOSITORY,
  type ITrackingEventRepository,
} from '../../domain/interfaces/tracking-event-repository.interface.js';
import { TrackingEventFilterDto } from '../dto/tracking-event-filter.dto.js';
import { TrackingEventMapper } from '../mappers/tracking-event.mapper.js';

@Injectable()
export class ListTrackingEventsUseCase {
  constructor(
    @Inject(TRACKING_EVENT_REPOSITORY)
    private readonly trackingEventRepository: ITrackingEventRepository,
  ) {}

  async execute(filter: TrackingEventFilterDto) {
    const result = await this.trackingEventRepository.findAll(filter);
    return {
      items: result.items.map((event) => TrackingEventMapper.toResponse(event)),
      meta: result.meta,
    };
  }
}
