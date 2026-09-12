import { Contact } from '../../domain/entities/contact.entity.js';
import { ContactResponseDto } from '../dto/contact-response.dto.js';
import { ContactModel } from '../../infrastructure/persistence/models/contact.model.js';

export class ContactMapper {
  static toDomain(model: ContactModel): Contact {
    return Contact.reconstitute({
      id: model.id,
      companyId: model.companyId,
      name: model.name,
      position: model.position ?? undefined,
      phone: model.phone ?? undefined,
      email: model.email ?? undefined,
      isPrimary: model.isPrimary,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Contact): ContactResponseDto {
    return {
      id: entity.id!,
      companyId: entity.companyId,
      name: entity.name,
      position: entity.position,
      phone: entity.phone,
      email: entity.email,
      isPrimary: entity.isPrimary,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Contact): Partial<ContactModel> {
    return {
      id: entity.id,
      companyId: entity.companyId,
      name: entity.name,
      position: entity.position ?? null,
      phone: entity.phone ?? null,
      email: entity.email ?? null,
      isPrimary: entity.isPrimary ?? false,
      isActive: entity.isActive ?? true,
    };
  }
}
