import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class RouteNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Ruta', id);
  }
}
