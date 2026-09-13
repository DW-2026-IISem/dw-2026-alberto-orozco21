import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class MarkInvoicePaidDto {
  @ApiPropertyOptional({ example: '2026-09-10T15:00:00Z' })
  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}
