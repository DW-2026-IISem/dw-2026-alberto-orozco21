import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Shipment, ShipmentPayload } from '../../core/models/shipment.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class ShipmentApi extends EntityApi<Shipment, ShipmentPayload> {
  constructor() {
    super(`${environment.apiUrl}/shipments`, 'shipments', 'shipment');
  }
}