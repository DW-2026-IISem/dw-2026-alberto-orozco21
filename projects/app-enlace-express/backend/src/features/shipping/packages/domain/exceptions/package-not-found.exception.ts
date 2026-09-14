import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class PackageNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Paquete', id);
  }
}
