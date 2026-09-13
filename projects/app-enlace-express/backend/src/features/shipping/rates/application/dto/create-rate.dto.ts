import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RateCalculationRule } from '../../domain/enums/rate-calculation-rule.enum.js';

export class CreateRateDto {
  @ApiProperty({ example: 'Tarifa zona Barranquilla' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Barranquilla' })
  @IsOptional()
  @IsString()
  zone?: string;

  @ApiProperty({ enum: RateCalculationRule, example: RateCalculationRule.BY_ZONE })
  @IsEnum(RateCalculationRule)
  calculationRule: RateCalculationRule;

  @ApiProperty({ example: 12000 })
  @IsNumber()
  @Min(0)
  baseValue: number;

  @ApiPropertyOptional({ example: 800, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalValuePerKg?: number;

  @ApiPropertyOptional({ example: 25, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  urgentSurchargePct?: number;

  @ApiProperty({ example: '2026-01-01' })
  @IsDateString()
  validFrom: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  validUntil?: string;
}
