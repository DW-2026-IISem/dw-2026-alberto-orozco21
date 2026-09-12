import { Contact } from '../../../domain/entities/contact.entity.js';
import { ContactResponseDto } from '../../../application/dto/contact-response.dto.js';
import { ContactMapper } from '../../../application/mappers/contact.mapper.js';

export class ContactSerializer {
  static serialize(entity: Contact): ContactResponseDto {
    return ContactMapper.toResponse(entity);
  }
}
