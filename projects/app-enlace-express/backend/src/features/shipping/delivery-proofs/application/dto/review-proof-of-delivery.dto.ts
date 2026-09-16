import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReviewProofOfDeliveryDto {
  @ApiPropertyOptional({ example: 'Firma no coincide con el documento del receptor' })
  @IsOptional()
  @IsString()
  notes?: string;
}
