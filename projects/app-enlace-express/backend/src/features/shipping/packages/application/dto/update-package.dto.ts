import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto.js';

export class UpdatePackageDto extends PartialType(
  OmitType(CreatePackageDto, ['shipmentId'] as const),
) {}
