import { Inject, Injectable } from '@nestjs/common';
import { CompanyNotFoundException } from '../../../companies/domain/exceptions/company-not-found.exception.js';
import {
  COMPANY_REPOSITORY,
  type ICompanyRepository,
} from '../../../companies/domain/interfaces/company-repository.interface.js';
import { Address } from '../../domain/entities/address.entity.js';
import {
  ADDRESS_REPOSITORY,
  type IAddressRepository,
} from '../../domain/interfaces/address-repository.interface.js';
import { CreateAddressDto } from '../dto/create-address.dto.js';
import { AddressMapper } from '../mappers/address.mapper.js';

@Injectable()
export class CreateAddressUseCase {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(dto: CreateAddressDto) {
    const company = await this.companyRepository.findById(dto.companyId);
    if (!company) {
      throw new CompanyNotFoundException(dto.companyId);
    }

    const address = Address.create({
      companyId: dto.companyId,
      alias: dto.alias,
      addressLine1: dto.addressLine1,
      addressLine2: dto.addressLine2,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      postalCode: dto.postalCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      type: dto.type,
    });

    const created = await this.addressRepository.create(address);
    return AddressMapper.toResponse(created);
  }
}
