import { Inject, Injectable } from '@nestjs/common';
import { ProofOfDeliveryNotFoundException } from '../../domain/exceptions/proof-of-delivery-not-found.exception.js';
import {
  PROOF_OF_DELIVERY_REPOSITORY,
  type IProofOfDeliveryRepository,
} from '../../domain/interfaces/proof-of-delivery-repository.interface.js';
import { ReviewProofOfDeliveryDto } from '../dto/review-proof-of-delivery.dto.js';
import { ProofOfDeliveryMapper } from '../mappers/proof-of-delivery.mapper.js';

@Injectable()
export class MarkProofRejectedUseCase {
  constructor(
    @Inject(PROOF_OF_DELIVERY_REPOSITORY)
    private readonly proofRepository: IProofOfDeliveryRepository,
  ) {}

  async execute(id: number, dto: ReviewProofOfDeliveryDto) {
    const proof = await this.proofRepository.findById(id);
    if (!proof) throw new ProofOfDeliveryNotFoundException(id);

    proof.markRejected(dto.notes);

    const updated = await this.proofRepository.update(proof);
    return ProofOfDeliveryMapper.toResponse(updated);
  }
}
