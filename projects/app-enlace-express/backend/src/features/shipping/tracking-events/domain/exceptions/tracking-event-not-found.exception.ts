import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class TrackingEventNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Evento de tracking', id);
  }
}
