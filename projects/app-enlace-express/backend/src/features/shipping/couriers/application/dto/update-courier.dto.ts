import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCourierDto } from './create-courier.dto.js';

export class UpdateCourierDto extends PartialType(
  OmitType(CreateCourierDto, ['documentId'] as const),
) {}
