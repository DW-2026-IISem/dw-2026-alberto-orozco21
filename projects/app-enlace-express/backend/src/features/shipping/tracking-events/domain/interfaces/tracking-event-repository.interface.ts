import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { TrackingEventType } from '../enums/tracking-event-type.enum.js';
import { TrackingEvent } from '../entities/tracking-event.entity.js';

export const TRACKING_EVENT_REPOSITORY = 'TRACKING_EVENT_REPOSITORY';

export interface TrackingEventFindAllParams {
  page?: number;
  limit?: number;
  shipmentId?: number;
  type?: TrackingEventType;
}

export interface ITrackingEventRepository {
  create(event: TrackingEvent): Promise<TrackingEvent>;
  findById(id: number): Promise<TrackingEvent | null>;
  findAll(params: TrackingEventFindAllParams): Promise<PaginatedResult<TrackingEvent>>;
}
