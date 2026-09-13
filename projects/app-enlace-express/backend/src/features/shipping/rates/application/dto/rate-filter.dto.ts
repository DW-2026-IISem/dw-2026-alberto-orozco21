import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { RateCalculationRule } from '../../domain/enums/rate-calculation-rule.enum.js';

export class RateFilterDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  limit?: number;

  @ApiPropertyOptional({ example: 'zona norte' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: RateCalculationRule, example: RateCalculationRule.BY_ZONE })
  @IsOptional()
  @IsEnum(RateCalculationRule)
  calculationRule?: RateCalculationRule;

  @ApiPropertyOptional({ example: 'Barranquilla' })
  @IsOptional()
  @IsString()
  zone?: string;
}
