import { Rate } from '../../../domain/entities/rate.entity.js';
import { RateResponseDto } from '../../../application/dto/rate-response.dto.js';
import { RateMapper } from '../../../application/mappers/rate.mapper.js';

export class RateSerializer {
  static serialize(entity: Rate): RateResponseDto {
    return RateMapper.toResponse(entity);
  }
}
