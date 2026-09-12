import { Inject, Injectable } from '@nestjs/common';
import { ContactNotFoundException } from '../../domain/exceptions/contact-not-found.exception.js';
import {
  CONTACT_REPOSITORY,
  type IContactRepository,
} from '../../domain/interfaces/contact-repository.interface.js';
import { ContactMapper } from '../mappers/contact.mapper.js';

@Injectable()
export class GetContactUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
  ) {}

  async execute(id: number) {
    const contact = await this.contactRepository.findById(id);
    if (!contact) {
      throw new ContactNotFoundException(id);
    }

    return ContactMapper.toResponse(contact);
  }
}
