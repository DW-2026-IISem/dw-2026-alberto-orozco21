import { Inject, Injectable } from '@nestjs/common';
import { AddressNotFoundException } from '../../domain/exceptions/address-not-found.exception.js';
import {
  ADDRESS_REPOSITORY,
  type IAddressRepository,
} from '../../domain/interfaces/address-repository.interface.js';
import { UpdateAddressDto } from '../dto/update-address.dto.js';
import { AddressMapper } from '../mappers/address.mapper.js';

@Injectable()
export class UpdateAddressUseCase {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(id: number, dto: UpdateAddressDto) {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new AddressNotFoundException(id);
    }

    address.update(dto);
    const updated = await this.addressRepository.update(address);
    return AddressMapper.toResponse(updated);
  }
}
