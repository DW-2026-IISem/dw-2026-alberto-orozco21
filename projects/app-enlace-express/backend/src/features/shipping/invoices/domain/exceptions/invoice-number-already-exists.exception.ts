import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class InvoiceNumberAlreadyExistsException extends DomainException {
  constructor(number: string) {
    super(`El número de factura '${number}' ya está registrado`);
  }
}
