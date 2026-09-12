import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class ContactNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Contacto', id);
  }
}
