import { ProofOfDelivery } from '../../../domain/entities/proof-of-delivery.entity.js';
import { ProofOfDeliveryResponseDto } from '../../../application/dto/proof-of-delivery-response.dto.js';
import { ProofOfDeliveryMapper } from '../../../application/mappers/proof-of-delivery.mapper.js';

export class ProofOfDeliverySerializer {
  static serialize(entity: ProofOfDelivery): ProofOfDeliveryResponseDto {
    return ProofOfDeliveryMapper.toResponse(entity);
  }
}
