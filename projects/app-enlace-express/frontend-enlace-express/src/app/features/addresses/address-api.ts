import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Address, AddressPayload } from '../../core/models/address.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class AddressApi extends EntityApi<Address, AddressPayload> {
  constructor() {
    super(`${environment.apiUrl}/address`, 'addresses', 'address');
  }
}