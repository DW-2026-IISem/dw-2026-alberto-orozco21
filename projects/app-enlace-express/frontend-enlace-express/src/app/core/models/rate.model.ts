import { ActiveRecord, Money } from './api.model';

export type CalculationRule = 'por_peso' | 'por_zona' | 'plana';

export interface Rate extends ActiveRecord {
  nombre: string;
  zona: string;
  regla_calculo: CalculationRule;
  valor_base: Money;
  valor_por_kg_adicional: Money | null;
  recargo_urgente_pct: Money | null;
  vigencia_desde: string;
  vigencia_hasta: string | null;
}

export interface RatePayload {
  nombre: string;
  zona: string;
  regla_calculo: CalculationRule;
  valor_base: number;
  valor_por_kg_adicional?: number | null;
  recargo_urgente_pct?: number | null;
  vigencia_desde: string;
  vigencia_hasta?: string | null;
  is_active?: boolean;
}