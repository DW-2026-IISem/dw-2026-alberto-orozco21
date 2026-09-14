import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShipmentPriority } from '../../domain/enums/shipment-priority.enum.js';
import { ShipmentStatus } from '../../domain/enums/shipment-status.enum.js';

export class ShipmentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ENV-LK3F9A-B7K2' })
  guideNumber: string;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ example: 1 })
  originContactId: number;

  @ApiProperty({ example: 1 })
  originAddressId: number;

  @ApiProperty({ example: 2 })
  destinationContactId: number;

  @ApiProperty({ example: 2 })
  destinationAddressId: number;

  @ApiProperty({ example: 1 })
  rateId: number;

  @ApiPropertyOptional({ example: 1 })
  courierId?: number;

  @ApiPropertyOptional({ example: 1 })
  routeId?: number;

  @ApiPropertyOptional({ example: 1 })
  invoiceId?: number;

  @ApiProperty({ enum: ShipmentPriority, example: ShipmentPriority.NORMAL })
  priority: ShipmentPriority;

  @ApiProperty({ example: 5 })
  totalWeightKg: number;

  @ApiProperty({ example: 150000 })
  declaredValue: number;

  @ApiPropertyOptional({ example: 18500 })
  calculatedCost?: number;

  @ApiProperty({ enum: ShipmentStatus, example: ShipmentStatus.CREATED })
  status: ShipmentStatus;

  @ApiProperty()
  requestDate: Date;

  @ApiProperty()
  estimatedDeliveryDate: Date;

  @ApiPropertyOptional()
  actualDeliveryDate?: Date;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
