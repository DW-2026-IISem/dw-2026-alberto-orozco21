import { Address } from '../../domain/entities/address.entity.js';
import { AddressResponseDto } from '../dto/address-response.dto.js';
import { AddressModel } from '../../infrastructure/persistence/models/address.model.js';

export class AddressMapper {
  static toDomain(model: AddressModel): Address {
    return Address.reconstitute({
      id: model.id,
      companyId: model.companyId,
      alias: model.alias,
      addressLine1: model.addressLine1,
      addressLine2: model.addressLine2 ?? undefined,
      city: model.city,
      state: model.state ?? undefined,
      country: model.country,
      postalCode: model.postalCode ?? undefined,
      latitude: model.latitude !== null ? Number(model.latitude) : undefined,
      longitude:
        model.longitude !== null ? Number(model.longitude) : undefined,
      type: model.type,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Address): AddressResponseDto {
    return {
      id: entity.id!,
      companyId: entity.companyId,
      alias: entity.alias,
      addressLine1: entity.addressLine1,
      addressLine2: entity.addressLine2,
      city: entity.city,
      state: entity.state,
      country: entity.country,
      postalCode: entity.postalCode,
      latitude: entity.latitude,
      longitude: entity.longitude,
      type: entity.type,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Address): Partial<AddressModel> {
    return {
      id: entity.id,
      companyId: entity.companyId,
      alias: entity.alias,
      addressLine1: entity.addressLine1,
      addressLine2: entity.addressLine2 ?? null,
      city: entity.city,
      state: entity.state ?? null,
      country: entity.country,
      postalCode: entity.postalCode ?? null,
      latitude: entity.latitude ?? null,
      longitude: entity.longitude ?? null,
      type: entity.type,
      isActive: entity.isActive ?? true,
    };
  }
}
