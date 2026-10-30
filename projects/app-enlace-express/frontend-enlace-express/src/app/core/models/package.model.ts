import { ActiveRecord, Money } from './api.model';

export interface Package extends ActiveRecord {
  envio_id: number;
  descripcion_contenido: string | null;
  peso_kg: Money;
  alto_cm: Money | null;
  ancho_cm: Money | null;
  largo_cm: Money | null;
  valor_declarado: Money | null;
  es_fragil: boolean;
}

export interface PackagePayload {
  envio_id: number;
  descripcion_contenido?: string | null;
  peso_kg: number;
  alto_cm?: number | null;
  ancho_cm?: number | null;
  largo_cm?: number | null;
  valor_declarado?: number | null;
  es_fragil?: boolean;
  is_active?: boolean;
}