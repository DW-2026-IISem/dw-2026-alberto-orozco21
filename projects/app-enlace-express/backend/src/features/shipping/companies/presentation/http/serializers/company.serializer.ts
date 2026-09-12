import { Company } from '../../../domain/entities/company.entity.js';
import { CompanyResponseDto } from '../../../application/dto/company-response.dto.js';
import { CompanyMapper } from '../../../application/mappers/company.mapper.js';

export class CompanySerializer {
  static serialize(entity: Company): CompanyResponseDto {
    return CompanyMapper.toResponse(entity);
  }
}
