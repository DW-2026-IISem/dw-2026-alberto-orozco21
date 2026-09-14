import { Package } from '../../domain/entities/package.entity.js';
import { PackageResponseDto } from '../dto/package-response.dto.js';
import { PackageModel } from '../../infrastructure/persistence/models/package.model.js';

export class PackageMapper {
  static toDomain(model: PackageModel): Package {
    return Package.reconstitute({
      id: model.id,
      shipmentId: model.shipmentId,
      contentDescription: model.contentDescription,
      weightKg: Number(model.weightKg),
      heightCm: Number(model.heightCm),
      widthCm: Number(model.widthCm),
      lengthCm: Number(model.lengthCm),
      declaredValue: Number(model.declaredValue),
      isFragile: model.isFragile,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Package): PackageResponseDto {
    return {
      id: entity.id!,
      shipmentId: entity.shipmentId,
      contentDescription: entity.contentDescription,
      weightKg: entity.weightKg,
      heightCm: entity.heightCm,
      widthCm: entity.widthCm,
      lengthCm: entity.lengthCm,
      declaredValue: entity.declaredValue,
      isFragile: entity.isFragile,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Package): Partial<PackageModel> {
    return {
      id: entity.id,
      shipmentId: entity.shipmentId,
      contentDescription: entity.contentDescription,
      weightKg: entity.weightKg,
      heightCm: entity.heightCm,
      widthCm: entity.widthCm,
      lengthCm: entity.lengthCm,
      declaredValue: entity.declaredValue,
      isFragile: entity.isFragile ?? false,
      isActive: entity.isActive ?? true,
    };
  }
}
