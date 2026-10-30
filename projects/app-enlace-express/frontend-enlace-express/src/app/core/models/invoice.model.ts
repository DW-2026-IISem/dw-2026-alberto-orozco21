import { ActiveRecord, Money } from './api.model';

export type InvoiceStatus = 'pendiente' | 'pagada' | 'vencida' | 'anulada';

export interface Invoice extends ActiveRecord {
  numero: string;
  empresa_id: number;
  periodo_desde: string;
  periodo_hasta: string;
  fecha: string;
  subtotal: Money;
  impuestos: Money | null;
  total: Money;
  estado: InvoiceStatus;
  fecha_pago: string | null;
}

export interface InvoicePayload {
  numero: string;
  empresa_id: number;
  periodo_desde: string;
  periodo_hasta: string;
  fecha: string;
  subtotal: number;
  impuestos?: number | null;
  total: number;
  estado: InvoiceStatus;
  fecha_pago?: string | null;
  is_active?: boolean;
}