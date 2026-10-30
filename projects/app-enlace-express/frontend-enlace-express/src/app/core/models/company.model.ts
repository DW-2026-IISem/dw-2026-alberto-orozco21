import { ActiveRecord } from './api.model';

export interface Company extends ActiveRecord {
  nit: string;
  razon_social: string;
  contacto_principal_id: number | null;
  direccion_facturacion_id: number | null;
}

export interface CompanyPayload {
  nit: string;
  razon_social: string;
  contacto_principal_id?: number | null;
  direccion_facturacion_id?: number | null;
  is_active?: boolean;
}