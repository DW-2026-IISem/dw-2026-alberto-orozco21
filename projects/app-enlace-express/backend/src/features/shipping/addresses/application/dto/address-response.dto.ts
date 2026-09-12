import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressType } from '../../domain/enums/address-type.enum.js';

export class AddressResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ example: 'Bodega norte' })
  alias: string;

  @ApiProperty({ example: 'Cra 45 # 98-20' })
  addressLine1: string;

  @ApiPropertyOptional({ example: 'Bodega 3, interior 2' })
  addressLine2?: string;

  @ApiProperty({ example: 'Barranquilla' })
  city: string;

  @ApiPropertyOptional({ example: 'Atlántico' })
  state?: string;

  @ApiProperty({ example: 'Colombia' })
  country: string;

  @ApiPropertyOptional({ example: '080020' })
  postalCode?: string;

  @ApiPropertyOptional({ example: 11.0184 })
  latitude?: number;

  @ApiPropertyOptional({ example: -74.8508 })
  longitude?: number;

  @ApiProperty({ enum: AddressType, example: AddressType.MIXED })
  type: AddressType;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
