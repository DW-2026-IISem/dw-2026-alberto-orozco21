import { Inject, Injectable } from '@nestjs/common';
import {
  CONTACT_REPOSITORY,
  type IContactRepository,
} from '../../domain/interfaces/contact-repository.interface.js';
import { ContactFilterDto } from '../dto/contact-filter.dto.js';
import { ContactMapper } from '../mappers/contact.mapper.js';

@Injectable()
export class ListContactsUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY)
    private readonly contactRepository: IContactRepository,
  ) {}

  async execute(filter: ContactFilterDto) {
    const result = await this.contactRepository.findAll(filter);
    return {
      items: result.items.map((contact) => ContactMapper.toResponse(contact)),
      meta: result.meta,
    };
  }
}
