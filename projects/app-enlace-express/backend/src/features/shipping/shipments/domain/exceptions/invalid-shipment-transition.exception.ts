import { DomainException } from '../../../../../common/exceptions/domain.exception.js';
import { ShipmentStatus } from '../enums/shipment-status.enum.js';

export class InvalidShipmentTransitionException extends DomainException {
  constructor(from: ShipmentStatus, action: string) {
    super(`No se puede '${action}' un envío en estado '${from}'`);
  }
}
