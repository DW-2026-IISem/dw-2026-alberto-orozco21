import { Inject, Injectable } from '@nestjs/common';
import { AddressNotFoundException } from '../../domain/exceptions/address-not-found.exception.js';
import {
  ADDRESS_REPOSITORY,
  type IAddressRepository,
} from '../../domain/interfaces/address-repository.interface.js';

@Injectable()
export class DeleteAddressUseCase {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new AddressNotFoundException(id);
    }

    await this.addressRepository.delete(id);
  }
}
