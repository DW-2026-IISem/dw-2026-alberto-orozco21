import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { TrackingEventType } from '../../domain/enums/tracking-event-type.enum.js';

export class TrackingEventFilterDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  shipmentId?: number;

  @ApiPropertyOptional({ enum: TrackingEventType, example: TrackingEventType.IN_TRANSIT })
  @IsOptional()
  @IsEnum(TrackingEventType)
  type?: TrackingEventType;
}
