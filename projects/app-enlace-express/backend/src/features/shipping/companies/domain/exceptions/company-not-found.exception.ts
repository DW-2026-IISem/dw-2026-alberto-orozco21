import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class CompanyNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Empresa', id);
  }
}
