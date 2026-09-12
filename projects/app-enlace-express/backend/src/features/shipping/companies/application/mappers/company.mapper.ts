import { Company } from '../../domain/entities/company.entity.js';
import { CompanyResponseDto } from '../dto/company-response.dto.js';
import { CompanyModel } from '../../infrastructure/persistence/models/company.model.js';

export class CompanyMapper {
  static toDomain(model: CompanyModel): Company {
    return Company.reconstitute({
      id: model.id,
      nit: model.nit,
      razonSocial: model.razonSocial,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Company): CompanyResponseDto {
    return {
      id: entity.id!,
      nit: entity.nit,
      razonSocial: entity.razonSocial,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Company): Partial<CompanyModel> {
    return {
      id: entity.id,
      nit: entity.nit,
      razonSocial: entity.razonSocial,
      isActive: entity.isActive ?? true,
    };
  }
}
