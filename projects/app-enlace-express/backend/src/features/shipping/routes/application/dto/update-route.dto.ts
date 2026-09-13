import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateRouteDto } from './create-route.dto.js';

export class UpdateRouteDto extends PartialType(
  OmitType(CreateRouteDto, ['courierId'] as const),
) {}
