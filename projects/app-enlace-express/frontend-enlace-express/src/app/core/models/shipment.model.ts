import { ActiveRecord, Money } from './api.model';

export type ShipmentPriority = 'normal' | 'urgente' | 'express';
export type ShipmentStatus =
  | 'creado'
  | 'cotizado'
  | 'asignado'
  | 'en_ruta'
  | 'entregado'
  | 'con_novedad'
  | 'cancelado';

export interface Shipment extends ActiveRecord {
  numero_guia: string;
  empresa_id: number;
  contacto_origen_id: number;
  direccion_origen_id: number;
  contacto_destino_id: number;
  direccion_destino_id: number;
  mensajero_id: number | null;
  ruta_id: number | null;
  tarifa_id: number;
  factura_id: number | null;
  prioridad: ShipmentPriority;
  peso_total_kg: Money;
  valor_declarado: Money | null;
  costo_calculado: Money | null;
  estado: ShipmentStatus;
  fecha_solicitud: string;
  fecha_entrega_estimada: string | null;
  fecha_entrega_real: string | null;
}

export interface ShipmentPayload {
  numero_guia: string;
  empresa_id: number;
  contacto_origen_id: number;
  direccion_origen_id: number;
  contacto_destino_id: number;
  direccion_destino_id: number;
  mensajero_id?: number | null;
  ruta_id?: number | null;
  tarifa_id: number;
  factura_id?: number | null;
  prioridad: ShipmentPriority;
  peso_total_kg: number;
  valor_declarado?: number | null;
  costo_calculado?: number | null;
  estado: ShipmentStatus;
  fecha_solicitud: string;
  fecha_entrega_estimada?: string | null;
  fecha_entrega_real?: string | null;
  is_active?: boolean;
}