import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class ShipmentNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Envío', id);
  }
}
