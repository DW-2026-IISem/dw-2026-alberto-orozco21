import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Contact } from '../entities/contact.entity.js';

export const CONTACT_REPOSITORY = 'CONTACT_REPOSITORY';

export interface ContactFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: number;
}

export interface IContactRepository {
  create(contact: Contact): Promise<Contact>;
  update(contact: Contact): Promise<Contact>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Contact | null>;
  findAll(params: ContactFindAllParams): Promise<PaginatedResult<Contact>>;
  /** Quita el flag isPrimary de cualquier otro contacto de la misma empresa. */
  clearPrimaryFlag(companyId: number, excludeId?: number): Promise<void>;
}
