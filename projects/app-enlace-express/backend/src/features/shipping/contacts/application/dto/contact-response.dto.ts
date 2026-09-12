import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  companyId: number;

  @ApiProperty({ example: 'Laura Gómez' })
  name: string;

  @ApiPropertyOptional({ example: 'Gerente de Logística' })
  position?: string;

  @ApiPropertyOptional({ example: '+57 301 2223344' })
  phone?: string;

  @ApiPropertyOptional({ example: 'laura.gomez@example.com' })
  email?: string;

  @ApiProperty({ example: true })
  isPrimary: boolean;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
