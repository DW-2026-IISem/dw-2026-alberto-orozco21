import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TrackingEvent, TrackingEventPayload } from '../../core/models/tracking-event.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class TrackingEventApi extends EntityApi<TrackingEvent, TrackingEventPayload> {
  constructor() {
    super(`${environment.apiUrl}/tracking_events`, 'tracking_events', 'trackingEvent');
  }
}