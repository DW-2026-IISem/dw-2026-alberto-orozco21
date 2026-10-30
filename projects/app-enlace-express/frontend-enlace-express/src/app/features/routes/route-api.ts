import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Route, RoutePayload } from '../../core/models/route.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class RouteApi extends EntityApi<Route, RoutePayload> {
  constructor() {
    super(`${environment.apiUrl}/routes`, 'routes', 'route');
  }
}