import { ActiveRecord } from './api.model';

export interface Contact extends ActiveRecord {
  empresa_id: number;
  nombre: string;
  cargo: string | null;
  telefono: string | null;
  email: string | null;
  is_principal: boolean;
}

export interface ContactPayload {
  empresa_id: number;
  nombre: string;
  cargo?: string | null;
  telefono?: string | null;
  email?: string | null;
  is_principal?: boolean;
  is_active?: boolean;
}