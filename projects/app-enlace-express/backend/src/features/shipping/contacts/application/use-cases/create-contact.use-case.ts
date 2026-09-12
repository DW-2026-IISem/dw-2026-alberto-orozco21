import { Inject, Injectable } from '@nestjs/common';
import { CompanyNotFoundException } from '../../../companies/domain/exceptions/company-not-found.exception.js';
import {
  COMPANY_REPOSITORY,
  type ICompanyRepository,
} from '../../../companies/domain/interfaces/company-repository.interface.js';
import { Contact } from '../../domain/entities/contact.entity.js';
import {
  CONTACT_REPOSITORY,
  type IContactRepository,
} from '../../domain/interfaces/contact-repository.interface.js';
import { CreateContactDto } from '../dto/create-contact.dto.js';
import { ContactMapper } from '../mappers/contact.mapper.js';

@Injectable()
export class CreateContactUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(dto: CreateContactDto) {
    const company = await this.companyRepository.findById(dto.companyId);
    if (!company) {
      throw new CompanyNotFoundException(dto.companyId);
    }

    const contact = Contact.create({
      companyId: dto.companyId,
      name: dto.name,
      position: dto.position,
      phone: dto.phone,
      email: dto.email,
      isPrimary: dto.isPrimary,
    });

    if (contact.isPrimary) {
      await this.contactRepository.clearPrimaryFlag(dto.companyId);
    }

    const created = await this.contactRepository.create(contact);
    return ContactMapper.toResponse(created);
  }
}
