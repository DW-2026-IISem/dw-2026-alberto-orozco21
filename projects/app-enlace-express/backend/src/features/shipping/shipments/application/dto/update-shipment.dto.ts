import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateShipmentDto } from './create-shipment.dto.js';

export class UpdateShipmentDto extends PartialType(
  PickType(CreateShipmentDto, [
    'priority',
    'totalWeightKg',
    'declaredValue',
    'estimatedDeliveryDate',
  ] as const),
) {}
