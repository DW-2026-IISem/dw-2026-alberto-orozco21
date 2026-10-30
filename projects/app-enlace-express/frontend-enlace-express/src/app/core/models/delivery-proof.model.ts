import { ActiveRecord, Money } from './api.model';

export type DeliveryProofStatus = 'valida' | 'observada' | 'rechazada';

export interface DeliveryProof extends ActiveRecord {
  envio_id: number;
  fecha_hora: string;
  receptor_nombre: string;
  receptor_documento: string | null;
  firma_url: string | null;
  foto_url: string | null;
  geolocalizacion_lat: Money | null;
  geolocalizacion_lng: Money | null;
  observaciones: string | null;
  estado: DeliveryProofStatus;
}

export interface DeliveryProofPayload {
  envio_id: number;
  fecha_hora: string;
  receptor_nombre: string;
  receptor_documento?: string | null;
  firma_url?: string | null;
  foto_url?: string | null;
  geolocalizacion_lat?: number | null;
  geolocalizacion_lng?: number | null;
  observaciones?: string | null;
  estado: DeliveryProofStatus;
  is_active?: boolean;
}