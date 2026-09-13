import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { VehicleType } from '../../domain/enums/vehicle-type.enum.js';

export class CreateCourierDto {
  @ApiProperty({ example: 'Jorge Martínez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: '1042567890' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  documentId: string;

  @ApiPropertyOptional({ example: '+57 300 1112233' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.MOTORCYCLE })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiPropertyOptional({ example: 'ABC12D' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  licensePlate?: string;

  @ApiPropertyOptional({ example: 'Barranquilla Norte' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  assignedZone?: string;
}
