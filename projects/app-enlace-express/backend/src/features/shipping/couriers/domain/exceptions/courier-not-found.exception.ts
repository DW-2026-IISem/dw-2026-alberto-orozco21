import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class CourierNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Mensajero', id);
  }
}
