import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { ProofOfDelivery } from '../entities/proof-of-delivery.entity.js';

export const PROOF_OF_DELIVERY_REPOSITORY = 'PROOF_OF_DELIVERY_REPOSITORY';

export interface ProofOfDeliveryFindAllParams {
  page?: number;
  limit?: number;
}

export interface IProofOfDeliveryRepository {
  create(proof: ProofOfDelivery): Promise<ProofOfDelivery>;
  update(proof: ProofOfDelivery): Promise<ProofOfDelivery>;
  findById(id: number): Promise<ProofOfDelivery | null>;
  findByShipmentId(shipmentId: number): Promise<ProofOfDelivery | null>;
  findAll(params: ProofOfDeliveryFindAllParams): Promise<PaginatedResult<ProofOfDelivery>>;
}
