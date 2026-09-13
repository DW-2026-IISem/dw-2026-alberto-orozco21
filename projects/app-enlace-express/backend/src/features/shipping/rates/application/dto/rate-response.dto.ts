import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RateCalculationRule } from '../../domain/enums/rate-calculation-rule.enum.js';

export class RateResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Tarifa zona Barranquilla' })
  name: string;

  @ApiPropertyOptional({ example: 'Barranquilla' })
  zone?: string;

  @ApiProperty({ enum: RateCalculationRule, example: RateCalculationRule.BY_ZONE })
  calculationRule: RateCalculationRule;

  @ApiProperty({ example: 12000 })
  baseValue: number;

  @ApiProperty({ example: 800 })
  additionalValuePerKg: number;

  @ApiProperty({ example: 25 })
  urgentSurchargePct: number;

  @ApiProperty({ example: '2026-01-01' })
  validFrom: Date;

  @ApiPropertyOptional({ example: '2026-12-31' })
  validUntil?: Date;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
