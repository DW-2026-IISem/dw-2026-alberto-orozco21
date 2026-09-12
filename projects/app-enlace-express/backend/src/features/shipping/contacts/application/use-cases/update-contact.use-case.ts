import { Inject, Injectable } from '@nestjs/common';
import { ContactNotFoundException } from '../../domain/exceptions/contact-not-found.exception.js';
import {
  CONTACT_REPOSITORY,
  type IContactRepository,
} from '../../domain/interfaces/contact-repository.interface.js';
import { UpdateContactDto } from '../dto/update-contact.dto.js';
import { ContactMapper } from '../mappers/contact.mapper.js';

@Injectable()
export class UpdateContactUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
  ) {}

  async execute(id: number, dto: UpdateContactDto) {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new ContactNotFoundException(id);
    }

    contact.update(dto);

    if (dto.isPrimary === true) {
      await this.contactRepository.clearPrimaryFlag(contact.companyId, contact.id);
    }

    const updated = await this.contactRepository.update(contact);
    return ContactMapper.toResponse(updated);
  }
}
