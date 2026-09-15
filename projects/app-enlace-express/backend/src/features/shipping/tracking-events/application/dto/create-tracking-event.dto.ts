import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { TrackingEventType } from '../../domain/enums/tracking-event-type.enum.js';
import { TrackingEventSeverity } from '../../domain/enums/tracking-event-severity.enum.js';

export class CreateTrackingEventDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  shipmentId: number;

  @ApiProperty({ enum: TrackingEventType, example: TrackingEventType.IN_TRANSIT })
  @IsEnum(TrackingEventType)
  type: TrackingEventType;

  @ApiPropertyOptional({ example: '2026-09-15T10:30:00Z' })
  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @ApiPropertyOptional({ example: 'Centro de distribución, Soledad' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ example: 'Paquete en tránsito hacia destino' })
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiPropertyOptional({ enum: TrackingEventSeverity, default: TrackingEventSeverity.INFO })
  @IsOptional()
  @IsEnum(TrackingEventSeverity)
  severity?: TrackingEventSeverity;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  recordedByCourierId?: number;
}
