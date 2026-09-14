import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class AssignShipmentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  courierId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  routeId: number;
}
