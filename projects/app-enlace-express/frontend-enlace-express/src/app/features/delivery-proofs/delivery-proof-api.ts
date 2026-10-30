import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DeliveryProof, DeliveryProofPayload } from '../../core/models/delivery-proof.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class DeliveryProofApi extends EntityApi<DeliveryProof, DeliveryProofPayload> {
  constructor() {
    super(`${environment.apiUrl}/delivery_proofs`, 'delivery_proofs', 'deliveryProof');
  }
}