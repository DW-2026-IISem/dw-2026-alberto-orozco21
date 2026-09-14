import { Inject, Injectable } from '@nestjs/common';
import { CompanyNotFoundException } from '../../../companies/domain/exceptions/company-not-found.exception.js';
import {
  COMPANY_REPOSITORY,
  type ICompanyRepository,
} from '../../../companies/domain/interfaces/company-repository.interface.js';
import { ContactNotFoundException } from '../../../contacts/domain/exceptions/contact-not-found.exception.js';
import {
  CONTACT_REPOSITORY,
  type IContactRepository,
} from '../../../contacts/domain/interfaces/contact-repository.interface.js';
import { AddressNotFoundException } from '../../../addresses/domain/exceptions/address-not-found.exception.js';
import {
  ADDRESS_REPOSITORY,
  type IAddressRepository,
} from '../../../addresses/domain/interfaces/address-repository.interface.js';
import { RateNotFoundException } from '../../../rates/domain/exceptions/rate-not-found.exception.js';
import {
  RATE_REPOSITORY,
  type IRateRepository,
} from '../../../rates/domain/interfaces/rate-repository.interface.js';
import { Shipment } from '../../domain/entities/shipment.entity.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../domain/interfaces/shipment-repository.interface.js';
import { CreateShipmentDto } from '../dto/create-shipment.dto.js';
import { ShipmentMapper } from '../mappers/shipment.mapper.js';

@Injectable()
export class CreateShipmentUseCase {
  constructor(
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: IAddressRepository,
    @Inject(RATE_REPOSITORY)
    private readonly rateRepository: IRateRepository,
  ) {}

  async execute(dto: CreateShipmentDto) {
    const company = await this.companyRepository.findById(dto.companyId);
    if (!company) throw new CompanyNotFoundException(dto.companyId);

    const [originContact, destinationContact, originAddress, destinationAddress, rate] =
      await Promise.all([
        this.contactRepository.findById(dto.originContactId),
        this.contactRepository.findById(dto.destinationContactId),
        this.addressRepository.findById(dto.originAddressId),
        this.addressRepository.findById(dto.destinationAddressId),
        this.rateRepository.findById(dto.rateId),
      ]);

    if (!originContact) throw new ContactNotFoundException(dto.originContactId);
    if (!destinationContact) throw new ContactNotFoundException(dto.destinationContactId);
    if (!originAddress) throw new AddressNotFoundException(dto.originAddressId);
    if (!destinationAddress) throw new AddressNotFoundException(dto.destinationAddressId);
    if (!rate) throw new RateNotFoundException(dto.rateId);

    if (originContact.companyId !== dto.companyId) {
      throw new Error('El contacto de origen no pertenece a la empresa indicada');
    }
    if (destinationContact.companyId !== dto.companyId) {
      throw new Error('El contacto de destino no pertenece a la empresa indicada');
    }
    if (originAddress.companyId !== dto.companyId) {
      throw new Error('La dirección de origen no pertenece a la empresa indicada');
    }
    if (destinationAddress.companyId !== dto.companyId) {
      throw new Error('La dirección de destino no pertenece a la empresa indicada');
    }

    const shipment = Shipment.create({
      guideNumber: Shipment.generateGuideNumber(),
      companyId: dto.companyId,
      originContactId: dto.originContactId,
      originAddressId: dto.originAddressId,
      destinationContactId: dto.destinationContactId,
      destinationAddressId: dto.destinationAddressId,
      rateId: dto.rateId,
      priority: dto.priority,
      totalWeightKg: dto.totalWeightKg,
      declaredValue: dto.declaredValue,
      estimatedDeliveryDate: new Date(dto.estimatedDeliveryDate),
    });

    const created = await this.shipmentRepository.create(shipment);
    return ShipmentMapper.toResponse(created);
  }
}
