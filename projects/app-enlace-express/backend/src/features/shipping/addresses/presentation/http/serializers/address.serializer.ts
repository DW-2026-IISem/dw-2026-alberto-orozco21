import { Address } from '../../../domain/entities/address.entity.js';
import { AddressResponseDto } from '../../../application/dto/address-response.dto.js';
import { AddressMapper } from '../../../application/mappers/address.mapper.js';

export class AddressSerializer {
  static serialize(entity: Address): AddressResponseDto {
    return AddressMapper.toResponse(entity);
  }
}
