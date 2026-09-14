import { Package } from '../../../domain/entities/package.entity.js';
import { PackageResponseDto } from '../../../application/dto/package-response.dto.js';
import { PackageMapper } from '../../../application/mappers/package.mapper.js';

export class PackageSerializer {
  static serialize(entity: Package): PackageResponseDto {
    return PackageMapper.toResponse(entity);
  }
}
