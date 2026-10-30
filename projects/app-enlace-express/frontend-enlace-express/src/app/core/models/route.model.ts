import { ActiveRecord } from './api.model';

export type RouteStatus = 'planificada' | 'en_curso' | 'finalizada';

export interface Route extends ActiveRecord {
  nombre: string;
  mensajero_id: number;
  zona_cobertura: string | null;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  estado: RouteStatus;
}

export interface RoutePayload {
  nombre: string;
  mensajero_id: number;
  zona_cobertura?: string | null;
  fecha: string;
  hora_inicio?: string | null;
  hora_fin?: string | null;
  estado: RouteStatus;
  is_active?: boolean;
}