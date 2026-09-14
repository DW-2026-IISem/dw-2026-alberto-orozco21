import { Shipment } from '../../../domain/entities/shipment.entity.js';
import { ShipmentResponseDto } from '../../../application/dto/shipment-response.dto.js';
import { ShipmentMapper } from '../../../application/mappers/shipment.mapper.js';

export class ShipmentSerializer {
  static serialize(entity: Shipment): ShipmentResponseDto {
    return ShipmentMapper.toResponse(entity);
  }
}
