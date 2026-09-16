import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProofOfDeliveryStatus } from '../../domain/enums/proof-of-delivery-status.enum.js';

export class ProofOfDeliveryResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  shipmentId: number;

  @ApiProperty()
  deliveredAt: Date;

  @ApiProperty({ example: 'Recepción Bodega Central' })
  receiverName: string;

  @ApiProperty({ example: '1122334455' })
  receiverDocument: string;

  @ApiPropertyOptional({ example: 'https://example.com/evidence/signature.png' })
  signatureUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/evidence/photo.jpg' })
  photoUrl?: string;

  @ApiPropertyOptional({ example: 11.0184 })
  latitude?: number;

  @ApiPropertyOptional({ example: -74.8508 })
  longitude?: number;

  @ApiPropertyOptional({ example: 'Entregado sin novedad' })
  observations?: string;

  @ApiProperty({ enum: ProofOfDeliveryStatus, example: ProofOfDeliveryStatus.VALID })
  status: ProofOfDeliveryStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
