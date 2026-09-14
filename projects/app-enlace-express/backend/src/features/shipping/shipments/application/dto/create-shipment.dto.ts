import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { ShipmentPriority } from '../../domain/enums/shipment-priority.enum.js';

export class CreateShipmentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  originContactId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  originAddressId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  destinationContactId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  destinationAddressId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  rateId: number;

  @ApiPropertyOptional({ enum: ShipmentPriority, default: ShipmentPriority.NORMAL })
  @IsOptional()
  @IsEnum(ShipmentPriority)
  priority?: ShipmentPriority;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0.01)
  totalWeightKg: number;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  declaredValue: number;

  @ApiProperty({ example: '2026-09-17' })
  @IsDateString()
  estimatedDeliveryDate: string;
}
