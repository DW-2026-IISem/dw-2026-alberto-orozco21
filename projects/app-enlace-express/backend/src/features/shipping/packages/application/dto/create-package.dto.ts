import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreatePackageDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  shipmentId: number;

  @ApiProperty({ example: 'Repuestos electrónicos' })
  @IsString()
  @IsNotEmpty()
  contentDescription: string;

  @ApiProperty({ example: 3.5 })
  @IsNumber()
  @Min(0.01)
  weightKg: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  @Min(0.1)
  heightCm: number;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(0.1)
  widthCm: number;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0.1)
  lengthCm: number;

  @ApiProperty({ example: 120000 })
  @IsNumber()
  @Min(0)
  declaredValue: number;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  isFragile?: boolean;
}
