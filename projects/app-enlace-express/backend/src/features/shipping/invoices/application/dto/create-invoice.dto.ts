import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  companyId: number;

  @ApiProperty({ example: 'FAC-2026-0001' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  periodStart: string;

  @ApiProperty({ example: '2026-08-31' })
  @IsDateString()
  periodEnd: string;

  @ApiProperty({ example: '2026-09-01' })
  @IsDateString()
  issueDate: string;

  @ApiProperty({ example: 450000 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ example: 85500 })
  @IsNumber()
  @Min(0)
  taxes: number;
}
