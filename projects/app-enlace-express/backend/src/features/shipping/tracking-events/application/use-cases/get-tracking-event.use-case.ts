import { Inject, Injectable } from '@nestjs/common';
import { TrackingEventNotFoundException } from '../../domain/exceptions/tracking-event-not-found.exception.js';
import {
  TRACKING_EVENT_REPOSITORY,
  type ITrackingEventRepository,
} from '../../domain/interfaces/tracking-event-repository.interface.js';
import { TrackingEventMapper } from '../mappers/tracking-event.mapper.js';

@Injectable()
export class GetTrackingEventUseCase {
  constructor(
    @Inject(TRACKING_EVENT_REPOSITORY)
    private readonly trackingEventRepository: ITrackingEventRepository,
  ) {}

  async execute(id: number) {
    const event = await this.trackingEventRepository.findById(id);
    if (!event) throw new TrackingEventNotFoundException(id);
    return TrackingEventMapper.toResponse(event);
  }
}
