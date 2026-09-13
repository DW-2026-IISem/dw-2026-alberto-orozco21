import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType } from '../../domain/enums/vehicle-type.enum.js';

export class CourierResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Jorge Martínez' })
  name: string;

  @ApiProperty({ example: '1042567890' })
  documentId: string;

  @ApiPropertyOptional({ example: '+57 300 1112233' })
  phone?: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.MOTORCYCLE })
  vehicleType: VehicleType;

  @ApiPropertyOptional({ example: 'ABC12D' })
  licensePlate?: string;

  @ApiPropertyOptional({ example: 'Barranquilla Norte' })
  assignedZone?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
