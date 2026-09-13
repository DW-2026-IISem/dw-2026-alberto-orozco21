import { Courier } from '../../domain/entities/courier.entity.js';
import { CourierResponseDto } from '../dto/courier-response.dto.js';
import { CourierModel } from '../../infrastructure/persistence/models/courier.model.js';

export class CourierMapper {
  static toDomain(model: CourierModel): Courier {
    return Courier.reconstitute({
      id: model.id,
      name: model.name,
      documentId: model.documentId,
      phone: model.phone ?? undefined,
      vehicleType: model.vehicleType,
      licensePlate: model.licensePlate ?? undefined,
      assignedZone: model.assignedZone ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Courier): CourierResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      documentId: entity.documentId,
      phone: entity.phone,
      vehicleType: entity.vehicleType,
      licensePlate: entity.licensePlate,
      assignedZone: entity.assignedZone,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Courier): Partial<CourierModel> {
    return {
      id: entity.id,
      name: entity.name,
      documentId: entity.documentId,
      phone: entity.phone ?? null,
      vehicleType: entity.vehicleType,
      licensePlate: entity.licensePlate ?? null,
      assignedZone: entity.assignedZone ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
