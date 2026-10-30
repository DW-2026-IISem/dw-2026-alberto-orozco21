import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Rate, RatePayload } from '../../core/models/rate.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class RateApi extends EntityApi<Rate, RatePayload> {
  constructor() {
    super(`${environment.apiUrl}/rates`, 'rates', 'rate');
  }
}