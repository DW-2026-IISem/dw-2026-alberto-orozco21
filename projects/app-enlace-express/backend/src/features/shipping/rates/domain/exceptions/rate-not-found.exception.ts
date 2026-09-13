import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class RateNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Tarifa', id);
  }
}
