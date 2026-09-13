import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus } from '../../domain/enums/invoice-status.enum.js';

export class InvoiceResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ example: 'FAC-2026-0001' })
  number: string;

  @ApiProperty({ example: '2026-08-01' })
  periodStart: Date;

  @ApiProperty({ example: '2026-08-31' })
  periodEnd: Date;

  @ApiProperty({ example: '2026-09-01' })
  issueDate: Date;

  @ApiProperty({ example: 450000 })
  subtotal: number;

  @ApiProperty({ example: 85500 })
  taxes: number;

  @ApiProperty({ example: 535500 })
  total: number;

  @ApiProperty({ enum: InvoiceStatus, example: InvoiceStatus.PENDING })
  status: InvoiceStatus;

  @ApiPropertyOptional({ example: '2026-09-10T15:00:00Z' })
  paymentDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
