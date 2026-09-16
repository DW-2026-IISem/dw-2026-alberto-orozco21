import { ProofOfDelivery } from '../../domain/entities/proof-of-delivery.entity.js';
import { ProofOfDeliveryResponseDto } from '../dto/proof-of-delivery-response.dto.js';
import { ProofOfDeliveryModel } from '../../infrastructure/persistence/models/proof-of-delivery.model.js';

export class ProofOfDeliveryMapper {
  static toDomain(model: ProofOfDeliveryModel): ProofOfDelivery {
    return ProofOfDelivery.reconstitute({
      id: model.id,
      shipmentId: model.shipmentId,
      deliveredAt: model.deliveredAt,
      receiverName: model.receiverName,
      receiverDocument: model.receiverDocument,
      signatureUrl: model.signatureUrl ?? undefined,
      photoUrl: model.photoUrl ?? undefined,
      latitude: model.latitude !== null ? Number(model.latitude) : undefined,
      longitude: model.longitude !== null ? Number(model.longitude) : undefined,
      observations: model.observations ?? undefined,
      status: model.status,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: ProofOfDelivery): ProofOfDeliveryResponseDto {
    return {
      id: entity.id!,
      shipmentId: entity.shipmentId,
      deliveredAt: entity.deliveredAt,
      receiverName: entity.receiverName,
      receiverDocument: entity.receiverDocument,
      signatureUrl: entity.signatureUrl,
      photoUrl: entity.photoUrl,
      latitude: entity.latitude,
      longitude: entity.longitude,
      observations: entity.observations,
      status: entity.status,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: ProofOfDelivery): Partial<ProofOfDeliveryModel> {
    return {
      id: entity.id,
      shipmentId: entity.shipmentId,
      deliveredAt: entity.deliveredAt,
      receiverName: entity.receiverName,
      receiverDocument: entity.receiverDocument,
      signatureUrl: entity.signatureUrl ?? null,
      photoUrl: entity.photoUrl ?? null,
      latitude: entity.latitude ?? null,
      longitude: entity.longitude ?? null,
      observations: entity.observations ?? null,
      status: entity.status,
    };
  }
}
