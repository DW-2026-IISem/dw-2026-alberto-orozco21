import { ActiveRecord } from './api.model';

export type VehicleType = 'moto' | 'carro' | 'bicicleta' | 'a_pie';

export interface Messenger extends ActiveRecord {
  nombre: string;
  documento_identidad: string;
  telefono: string | null;
  tipo_vehiculo: VehicleType;
  placa_vehiculo: string | null;
  zona_asignada: string | null;
}

export interface MessengerPayload {
  nombre: string;
  documento_identidad: string;
  telefono?: string | null;
  tipo_vehiculo: VehicleType;
  placa_vehiculo?: string | null;
  zona_asignada?: string | null;
  is_active?: boolean;
}