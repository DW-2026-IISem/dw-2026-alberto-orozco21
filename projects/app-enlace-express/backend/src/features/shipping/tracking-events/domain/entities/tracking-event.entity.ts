import { TrackingEventType } from '../enums/tracking-event-type.enum.js';
import { TrackingEventSeverity } from '../enums/tracking-event-severity.enum.js';

export interface TrackingEventProps {
  id?: number;
  shipmentId: number;
  type: TrackingEventType;
  eventDate?: Date;
  location?: string;
  observations?: string;
  severity?: TrackingEventSeverity;
  recordedByCourierId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TrackingEvent {
  id?: number;
  shipmentId: number;
  type: TrackingEventType;
  eventDate: Date;
  location?: string;
  observations?: string;
  severity: TrackingEventSeverity;
  recordedByCourierId?: number;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: TrackingEventProps) {
    this.id = props.id;
    this.shipmentId = props.shipmentId;
    this.type = props.type;
    this.eventDate = props.eventDate ?? new Date();
    this.location = props.location;
    this.observations = props.observations;
    this.severity = props.severity ?? TrackingEventSeverity.INFO;
    this.recordedByCourierId = props.recordedByCourierId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<TrackingEventProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): TrackingEvent {
    if (!props.shipmentId) {
      throw new Error('El evento de tracking debe estar asociado a un envío');
    }
    if (!props.type) {
      throw new Error('El tipo de evento es requerido');
    }
    if (
      props.type === TrackingEventType.ISSUE &&
      (props.severity === undefined || props.severity === TrackingEventSeverity.INFO)
    ) {
      throw new Error(
        'Un evento de tipo "novedad" requiere severidad novedad_leve o novedad_critica',
      );
    }

    return new TrackingEvent(props);
  }

  static reconstitute(props: TrackingEventProps): TrackingEvent {
    return new TrackingEvent(props);
  }
}
