import { Route } from '../../domain/entities/route.entity.js';
import { RouteResponseDto } from '../dto/route-response.dto.js';
import { RouteModel } from '../../infrastructure/persistence/models/route.model.js';

export class RouteMapper {
  static toDomain(model: RouteModel): Route {
    return Route.reconstitute({
      id: model.id,
      courierId: model.courierId,
      name: model.name,
      coverageZone: model.coverageZone ?? undefined,
      date: new Date(model.date),
      startTime: model.startTime,
      endTime: model.endTime ?? undefined,
      status: model.status,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Route): RouteResponseDto {
    return {
      id: entity.id!,
      courierId: entity.courierId,
      name: entity.name,
      coverageZone: entity.coverageZone,
      date: entity.date,
      startTime: entity.startTime,
      endTime: entity.endTime,
      status: entity.status,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Route): Partial<RouteModel> {
    return {
      id: entity.id,
      courierId: entity.courierId,
      name: entity.name,
      coverageZone: entity.coverageZone ?? null,
      date: entity.date.toISOString().slice(0, 10) as any,
      startTime: entity.startTime,
      endTime: entity.endTime ?? null,
      status: entity.status,
      isActive: entity.isActive ?? true,
    };
  }
}
