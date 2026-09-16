import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class ProofOfDeliveryNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Prueba de entrega', id);
  }
}
