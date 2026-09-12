import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { AddressType } from '../enums/address-type.enum.js';
import { Address } from '../entities/address.entity.js';

export const ADDRESS_REPOSITORY = 'ADDRESS_REPOSITORY';

export interface AddressFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: number;
  type?: AddressType;
}

export interface IAddressRepository {
  create(address: Address): Promise<Address>;
  update(address: Address): Promise<Address>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Address | null>;
  findAll(params: AddressFindAllParams): Promise<PaginatedResult<Address>>;
}
