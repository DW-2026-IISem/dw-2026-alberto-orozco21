import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { RouteStatus } from '../../domain/enums/route-status.enum.js';

export class CreateRouteDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  courierId: number;

  @ApiProperty({ example: 'Ruta matutina norte' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Barranquilla Norte' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  coverageZone?: string;

  @ApiProperty({ example: '2026-09-15' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '2026-09-15T08:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({ example: '2026-09-15T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ enum: RouteStatus, example: RouteStatus.PLANNED })
  @IsOptional()
  @IsEnum(RouteStatus)
  status?: RouteStatus;
}
