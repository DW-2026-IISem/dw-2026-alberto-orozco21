import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { RateCalculationRule } from '../enums/rate-calculation-rule.enum.js';
import { Rate } from '../entities/rate.entity.js';

export const RATE_REPOSITORY = 'RATE_REPOSITORY';

export interface RateFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  calculationRule?: RateCalculationRule;
  zone?: string;
  includeInactive?: boolean;
}

export interface IRateRepository {
  create(rate: Rate): Promise<Rate>;
  update(rate: Rate): Promise<Rate>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Rate | null>;
  findAll(params: RateFindAllParams): Promise<PaginatedResult<Rate>>;
  /** Tarifa vigente para una zona en una fecha dada (usada luego por Envio). */
  findCurrentByZone(zone: string, date?: Date): Promise<Rate | null>;
}
