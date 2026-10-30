import { ActiveRecord, Money } from './api.model';

export type AddressType = 'recogida' | 'entrega' | 'mixta';

export interface Address extends ActiveRecord {
  empresa_id: number;
  alias: string;
  linea1: string;
  linea2: string | null;
  ciudad: string;
  departamento: string | null;
  pais: string | null;
  codigo_postal: string | null;
  latitud: Money | null;
  longitud: Money | null;
  tipo: AddressType;
}

export interface AddressPayload {
  empresa_id: number;
  alias: string;
  linea1: string;
  linea2?: string | null;
  ciudad: string;
  departamento?: string | null;
  pais?: string | null;
  codigo_postal?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  tipo: AddressType;
  is_active?: boolean;
}