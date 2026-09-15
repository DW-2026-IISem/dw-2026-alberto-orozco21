import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrackingEventType } from '../../domain/enums/tracking-event-type.enum.js';
import { TrackingEventSeverity } from '../../domain/enums/tracking-event-severity.enum.js';

export class TrackingEventResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  shipmentId: number;

  @ApiProperty({ enum: TrackingEventType, example: TrackingEventType.PICKED_UP })
  type: TrackingEventType;

  @ApiProperty()
  eventDate: Date;

  @ApiPropertyOptional({ example: 'Bodega norte, Barranquilla' })
  location?: string;

  @ApiPropertyOptional({ example: 'Envío recogido en el origen' })
  observations?: string;

  @ApiProperty({ enum: TrackingEventSeverity, example: TrackingEventSeverity.INFO })
  severity: TrackingEventSeverity;

  @ApiPropertyOptional({ example: 1 })
  recordedByCourierId?: number;

  @ApiProperty()
  createdAt: Date;
}
