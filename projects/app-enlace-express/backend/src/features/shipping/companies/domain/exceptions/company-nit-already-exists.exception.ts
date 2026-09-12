import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class CompanyNitAlreadyExistsException extends DomainException {
  constructor(nit: string) {
    super(`El NIT '${nit}' ya está registrado`);
  }
}
