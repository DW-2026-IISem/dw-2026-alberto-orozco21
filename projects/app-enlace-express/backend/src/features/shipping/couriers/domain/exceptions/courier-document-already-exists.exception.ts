import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class CourierDocumentAlreadyExistsException extends DomainException {
  constructor(documentId: string) {
    super(`El documento de identidad '${documentId}' ya está registrado`);
  }
}
