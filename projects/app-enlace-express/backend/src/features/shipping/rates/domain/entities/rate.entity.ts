import { RateCalculationRule } from '../enums/rate-calculation-rule.enum.js';

export interface RateProps {
  id?: number;
  name: string;
  zone?: string;
  calculationRule: RateCalculationRule;
  baseValue: number;
  additionalValuePerKg?: number;
  urgentSurchargePct?: number;
  validFrom: Date;
  validUntil?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Rate {
  id?: number;
  name: string;
  zone?: string;
  calculationRule: RateCalculationRule;
  baseValue: number;
  additionalValuePerKg: number;
  urgentSurchargePct: number;
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: RateProps) {
    this.id = props.id;
    this.name = props.name;
    this.zone = props.zone;
    this.calculationRule = props.calculationRule;
    this.baseValue = props.baseValue;
    this.additionalValuePerKg = props.additionalValuePerKg ?? 0;
    this.urgentSurchargePct = props.urgentSurchargePct ?? 0;
    this.validFrom = props.validFrom;
    this.validUntil = props.validUntil;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private static validateBusinessRules(props: {
    zone?: string;
    calculationRule: RateCalculationRule;
    baseValue: number;
    additionalValuePerKg?: number;
    urgentSurchargePct?: number;
    validFrom: Date;
    validUntil?: Date;
  }): void {
    if (props.calculationRule === RateCalculationRule.BY_ZONE && !props.zone?.trim()) {
      throw new Error('La zona es requerida cuando la regla de cálculo es "por_zona"');
    }

    if (props.baseValue === undefined || props.baseValue < 0) {
      throw new Error('El valor base debe ser un número positivo');
    }

    if (props.additionalValuePerKg !== undefined && props.additionalValuePerKg < 0) {
      throw new Error('El valor por kg adicional no puede ser negativo');
    }

    if (props.urgentSurchargePct !== undefined && props.urgentSurchargePct < 0) {
      throw new Error('El recargo urgente no puede ser negativo');
    }

    if (props.validUntil && props.validUntil <= props.validFrom) {
      throw new Error('La fecha de fin de vigencia debe ser posterior a la de inicio');
    }
  }

  static create(
    props: Omit<RateProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Rate {
    if (!props.name?.trim()) {
      throw new Error('El nombre de la tarifa es requerido');
    }

    Rate.validateBusinessRules(props);

    return new Rate(props);
  }

  static reconstitute(props: RateProps): Rate {
    return new Rate(props);
  }

  update(
    props: Partial<Omit<RateProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>,
  ): void {
    const next = {
      zone: props.zone !== undefined ? props.zone : this.zone,
      calculationRule: props.calculationRule ?? this.calculationRule,
      baseValue: props.baseValue ?? this.baseValue,
      additionalValuePerKg:
        props.additionalValuePerKg !== undefined
          ? props.additionalValuePerKg
          : this.additionalValuePerKg,
      urgentSurchargePct:
        props.urgentSurchargePct !== undefined
          ? props.urgentSurchargePct
          : this.urgentSurchargePct,
      validFrom: props.validFrom ?? this.validFrom,
      validUntil: props.validUntil !== undefined ? props.validUntil : this.validUntil,
    };

    if (props.name !== undefined && !props.name.trim()) {
      throw new Error('El nombre de la tarifa es requerido');
    }

    Rate.validateBusinessRules(next);

    if (props.name !== undefined) this.name = props.name;
    this.zone = next.zone;
    this.calculationRule = next.calculationRule;
    this.baseValue = next.baseValue;
    this.additionalValuePerKg = next.additionalValuePerKg;
    this.urgentSurchargePct = next.urgentSurchargePct;
    this.validFrom = next.validFrom;
    this.validUntil = next.validUntil;
  }

  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }
}
