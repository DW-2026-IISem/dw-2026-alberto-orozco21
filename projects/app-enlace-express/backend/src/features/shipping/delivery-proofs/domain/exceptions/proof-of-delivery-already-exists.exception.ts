import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class ProofOfDeliveryAlreadyExistsException extends DomainException {
  constructor(shipmentId: number) {
    super(`El envío ${shipmentId} ya tiene una prueba de entrega registrada`);
  }
}
