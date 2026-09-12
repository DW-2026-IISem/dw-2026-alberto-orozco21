import { Inject, Injectable } from '@nestjs/common';
import {
  ADDRESS_REPOSITORY,
  type IAddressRepository,
} from '../../domain/interfaces/address-repository.interface.js';
import { AddressFilterDto } from '../dto/address-filter.dto.js';
import { AddressMapper } from '../mappers/address.mapper.js';

@Injectable()
export class ListAddressesUseCase {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(filter: AddressFilterDto) {
    const result = await this.addressRepository.findAll(filter);
    return {
      items: result.items.map((address) => AddressMapper.toResponse(address)),
      meta: result.meta,
    };
  }
}
