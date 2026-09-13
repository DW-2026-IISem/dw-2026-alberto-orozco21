import { Rate } from '../../domain/entities/rate.entity.js';
import { RateResponseDto } from '../dto/rate-response.dto.js';
import { RateModel } from '../../infrastructure/persistence/models/rate.model.js';

export class RateMapper {
  static toDomain(model: RateModel): Rate {
    return Rate.reconstitute({
      id: model.id,
      name: model.name,
      zone: model.zone ?? undefined,
      calculationRule: model.calculationRule,
      baseValue: Number(model.baseValue),
      additionalValuePerKg: Number(model.additionalValuePerKg),
      urgentSurchargePct: Number(model.urgentSurchargePct),
      validFrom: new Date(model.validFrom),
      validUntil: model.validUntil ? new Date(model.validUntil) : undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Rate): RateResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      zone: entity.zone,
      calculationRule: entity.calculationRule,
      baseValue: entity.baseValue,
      additionalValuePerKg: entity.additionalValuePerKg,
      urgentSurchargePct: entity.urgentSurchargePct,
      validFrom: entity.validFrom,
      validUntil: entity.validUntil,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Rate): Partial<RateModel> {
    return {
      id: entity.id,
      name: entity.name,
      zone: entity.zone ?? null,
      calculationRule: entity.calculationRule,
      baseValue: entity.baseValue,
      additionalValuePerKg: entity.additionalValuePerKg,
      urgentSurchargePct: entity.urgentSurchargePct,
      validFrom: entity.validFrom.toISOString().slice(0, 10) as any,
      validUntil: entity.validUntil
        ? (entity.validUntil.toISOString().slice(0, 10) as any)
        : null,
      isActive: entity.isActive ?? true,
    };
  }
}
