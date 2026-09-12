import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { AddressType } from '../../domain/enums/address-type.enum.js';

export class CreateAddressDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ example: 'Bodega norte' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  alias: string;

  @ApiProperty({ example: 'Cra 45 # 98-20' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  addressLine1: string;

  @ApiPropertyOptional({ example: 'Bodega 3, interior 2' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @ApiProperty({ example: 'Barranquilla' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @ApiPropertyOptional({ example: 'Atlántico' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'Colombia', default: 'Colombia' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '080020' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ example: 11.0184 })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ example: -74.8508 })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ enum: AddressType, example: AddressType.MIXED })
  @IsOptional()
  @IsEnum(AddressType)
  type?: AddressType;
}
