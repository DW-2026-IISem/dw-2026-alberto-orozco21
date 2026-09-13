import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RouteStatus } from '../../domain/enums/route-status.enum.js';

export class RouteResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  courierId: number;

  @ApiProperty({ example: 'Ruta matutina norte' })
  name: string;

  @ApiPropertyOptional({ example: 'Barranquilla Norte' })
  coverageZone?: string;

  @ApiProperty({ example: '2026-09-15' })
  date: Date;

  @ApiProperty({ example: '2026-09-15T08:00:00Z' })
  startTime: Date;

  @ApiPropertyOptional({ example: '2026-09-15T12:00:00Z' })
  endTime?: Date;

  @ApiProperty({ enum: RouteStatus, example: RouteStatus.PLANNED })
  status: RouteStatus;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
