import { ActiveRecord } from './api.model';

export type TrackingEventType =
  | 'recogido'
  | 'en_transito'
  | 'en_reparto'
  | 'novedad'
  | 'entregado'
  | 'devuelto';
export type TrackingEventStatus = 'informativo' | 'novedad_leve' | 'novedad_critica';

export interface TrackingEvent extends ActiveRecord {
  envio_id: number;
  tipo: TrackingEventType;
  fecha: string;
  ubicacion: string | null;
  observaciones: string | null;
  estado: TrackingEventStatus;
  registrado_por_id: number | null;
}

export interface TrackingEventPayload {
  envio_id: number;
  tipo: TrackingEventType;
  fecha: string;
  ubicacion?: string | null;
  observaciones?: string | null;
  estado: TrackingEventStatus;
  registrado_por_id?: number | null;
  is_active?: boolean;
}