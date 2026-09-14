import { Shipment } from '../../domain/entities/shipment.entity.js';
import { ShipmentResponseDto } from '../dto/shipment-response.dto.js';
import { ShipmentModel } from '../../infrastructure/persistence/models/shipment.model.js';

export class ShipmentMapper {
  static toDomain(model: ShipmentModel): Shipment {
    return Shipment.reconstitute({
      id: model.id,
      guideNumber: model.guideNumber,
      companyId: model.companyId,
      originContactId: model.originContactId,
      originAddressId: model.originAddressId,
      destinationContactId: model.destinationContactId,
      destinationAddressId: model.destinationAddressId,
      rateId: model.rateId,
      courierId: model.courierId ?? undefined,
      routeId: model.routeId ?? undefined,
      invoiceId: model.invoiceId ?? undefined,
      priority: model.priority,
      totalWeightKg: Number(model.totalWeightKg),
      declaredValue: Number(model.declaredValue),
      calculatedCost:
        model.calculatedCost !== null ? Number(model.calculatedCost) : undefined,
      status: model.status,
      requestDate: model.requestDate,
      estimatedDeliveryDate: model.estimatedDeliveryDate,
      actualDeliveryDate: model.actualDeliveryDate ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Shipment): ShipmentResponseDto {
    return {
      id: entity.id!,
      guideNumber: entity.guideNumber,
      companyId: entity.companyId,
      originContactId: entity.originContactId,
      originAddressId: entity.originAddressId,
      destinationContactId: entity.destinationContactId,
      destinationAddressId: entity.destinationAddressId,
      rateId: entity.rateId,
      courierId: entity.courierId,
      routeId: entity.routeId,
      invoiceId: entity.invoiceId,
      priority: entity.priority,
      totalWeightKg: entity.totalWeightKg,
      declaredValue: entity.declaredValue,
      calculatedCost: entity.calculatedCost,
      status: entity.status,
      requestDate: entity.requestDate,
      estimatedDeliveryDate: entity.estimatedDeliveryDate,
      actualDeliveryDate: entity.actualDeliveryDate,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Shipment): Partial<ShipmentModel> {
    return {
      id: entity.id,
      guideNumber: entity.guideNumber,
      companyId: entity.companyId,
      originContactId: entity.originContactId,
      originAddressId: entity.originAddressId,
      destinationContactId: entity.destinationContactId,
      destinationAddressId: entity.destinationAddressId,
      rateId: entity.rateId,
      courierId: entity.courierId ?? null,
      routeId: entity.routeId ?? null,
      invoiceId: entity.invoiceId ?? null,
      priority: entity.priority,
      totalWeightKg: entity.totalWeightKg,
      declaredValue: entity.declaredValue,
      calculatedCost: entity.calculatedCost ?? null,
      status: entity.status,
      requestDate: entity.requestDate,
      estimatedDeliveryDate: entity.estimatedDeliveryDate,
      actualDeliveryDate: entity.actualDeliveryDate ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
