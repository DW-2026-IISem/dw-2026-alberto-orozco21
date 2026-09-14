import { ApiProperty } from '@nestjs/swagger';

export class PackageResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  shipmentId: number;

  @ApiProperty({ example: 'Repuestos electrónicos' })
  contentDescription: string;

  @ApiProperty({ example: 3.5 })
  weightKg: number;

  @ApiProperty({ example: 20 })
  heightCm: number;

  @ApiProperty({ example: 15 })
  widthCm: number;

  @ApiProperty({ example: 25 })
  lengthCm: number;

  @ApiProperty({ example: 120000 })
  declaredValue: number;

  @ApiProperty({ example: true })
  isFragile: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
