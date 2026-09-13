import { Courier } from '../../../domain/entities/courier.entity.js';
import { CourierResponseDto } from '../../../application/dto/courier-response.dto.js';
import { CourierMapper } from '../../../application/mappers/courier.mapper.js';

export class CourierSerializer {
  static serialize(entity: Courier): CourierResponseDto {
    return CourierMapper.toResponse(entity);
  }
}
