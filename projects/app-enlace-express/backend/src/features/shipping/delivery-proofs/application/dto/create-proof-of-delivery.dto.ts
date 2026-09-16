import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProofOfDeliveryDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  shipmentId: number;

  @ApiProperty({ example: 'Recepción Bodega Central' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  receiverName: string;

  @ApiProperty({ example: '1122334455' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  receiverDocument: string;

  @ApiPropertyOptional({ example: 'https://example.com/evidence/signature.png' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  signatureUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/evidence/photo.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  photoUrl?: string;

  @ApiPropertyOptional({ example: 11.0184 })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ example: -74.8508 })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ example: 'Entregado sin novedad' })
  @IsOptional()
  @IsString()
  observations?: string;
}
