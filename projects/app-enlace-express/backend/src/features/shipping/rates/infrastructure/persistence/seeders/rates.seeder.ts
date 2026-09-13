import { RateModel } from '../models/rate.model.js';
import { RateCalculationRule } from '../../../domain/enums/rate-calculation-rule.enum.js';

export async function seedRates(): Promise<void> {
  const count = await RateModel.count();
  if (count > 0) {
    return;
  }

  await RateModel.bulkCreate([
    {
      name: 'Tarifa zona Barranquilla',
      zone: 'Barranquilla',
      calculationRule: RateCalculationRule.BY_ZONE,
      baseValue: 12000,
      additionalValuePerKg: 800,
      urgentSurchargePct: 25,
      validFrom: '2026-01-01',
      validUntil: null,
      isActive: true,
    },
    {
      name: 'Tarifa por peso nacional',
      zone: null,
      calculationRule: RateCalculationRule.BY_WEIGHT,
      baseValue: 8000,
      additionalValuePerKg: 1200,
      urgentSurchargePct: 30,
      validFrom: '2026-01-01',
      validUntil: null,
      isActive: true,
    },
    {
      name: 'Tarifa plana mensajería local',
      zone: null,
      calculationRule: RateCalculationRule.FLAT,
      baseValue: 15000,
      additionalValuePerKg: 0,
      urgentSurchargePct: 20,
      validFrom: '2026-01-01',
      validUntil: null,
      isActive: true,
    },
  ]);
}
