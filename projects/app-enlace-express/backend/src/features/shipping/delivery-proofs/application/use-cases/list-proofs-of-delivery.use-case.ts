import { Inject, Injectable } from '@nestjs/common';
import {
  PROOF_OF_DELIVERY_REPOSITORY,
  type IProofOfDeliveryRepository,
} from '../../domain/interfaces/proof-of-delivery-repository.interface.js';
import { ProofOfDeliveryFilterDto } from '../dto/proof-of-delivery-filter.dto.js';
import { ProofOfDeliveryMapper } from '../mappers/proof-of-delivery.mapper.js';

@Injectable()
export class ListProofsOfDeliveryUseCase {
  constructor(
    @Inject(PROOF_OF_DELIVERY_REPOSITORY)
    private readonly proofRepository: IProofOfDeliveryRepository,
  ) {}

  async execute(filter: ProofOfDeliveryFilterDto) {
    const result = await this.proofRepository.findAll(filter);
    return {
      items: result.items.map((proof) => ProofOfDeliveryMapper.toResponse(proof)),
      meta: result.meta,
    };
  }
}
