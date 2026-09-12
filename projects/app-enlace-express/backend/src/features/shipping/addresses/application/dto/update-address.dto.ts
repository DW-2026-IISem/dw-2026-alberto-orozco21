import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAddressDto } from './create-address.dto.js';

export class UpdateAddressDto extends PartialType(
  OmitType(CreateAddressDto, ['companyId'] as const),
) {}
