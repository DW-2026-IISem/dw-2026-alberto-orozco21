import { Inject, Injectable } from '@nestjs/common';
import { ShipmentNotFoundException } from '../../../shipments/domain/exceptions/shipment-not-found.exception.js';
import {
  SHIPMENT_REPOSITORY,
  type IShipmentRepository,
} from '../../../shipments/domain/interfaces/shipment-repository.interface.js';
import { ProofOfDelivery } from '../../domain/entities/proof-of-delivery.entity.js';
import { ProofOfDeliveryAlreadyExistsException } from '../../domain/exceptions/proof-of-delivery-already-exists.exception.js';
import {
  PROOF_OF_DELIVERY_REPOSITORY,
  type IProofOfDeliveryRepository,
} from '../../domain/interfaces/proof-of-delivery-repository.interface.js';
import { CreateProofOfDeliveryDto } from '../dto/create-proof-of-delivery.dto.js';
import { ProofOfDeliveryMapper } from '../mappers/proof-of-delivery.mapper.js';

@Injectable()
export class CreateProofOfDeliveryUseCase {
  constructor(
    @Inject(PROOF_OF_DELIVERY_REPOSITORY)
    private readonly proofRepository: IProofOfDeliveryRepository,
    @Inject(SHIPMENT_REPOSITORY)
    private readonly shipmentRepository: IShipmentRepository,
  ) {}

  async execute(dto: CreateProofOfDeliveryDto) {
    const shipment = await this.shipmentRepository.findById(dto.shipmentId);
    if (!shipment) throw new ShipmentNotFoundException(dto.shipmentId);

    const existing = await this.proofRepository.findByShipmentId(dto.shipmentId);
    if (existing) throw new ProofOfDeliveryAlreadyExistsException(dto.shipmentId);

    const proof = ProofOfDelivery.create({
      shipmentId: dto.shipmentId,
      receiverName: dto.receiverName,
      receiverDocument: dto.receiverDocument,
      signatureUrl: dto.signatureUrl,
      photoUrl: dto.photoUrl,
      latitude: dto.latitude,
      longitude: dto.longitude,
      observations: dto.observations,
    });

    // La transición de dominio (valida que el envío esté 'en_ruta') vive en
    // Shipment.deliver() — ver fase 14. Si el envío no está en ese estado,
    // esto lanza InvalidShipmentTransitionException antes de guardar nada.
    shipment.deliver(proof.deliveredAt);

    const created = await this.proofRepository.create(proof);
    await this.shipmentRepository.update(shipment);

    return ProofOfDeliveryMapper.toResponse(created);
  }
}
