import { Module } from '@nestjs/common';
import { ShipmentsModule } from '../shipments/shipments.module.js';
import { PROOF_OF_DELIVERY_REPOSITORY } from './domain/interfaces/proof-of-delivery-repository.interface.js';
import { ProofOfDeliveryRepository } from './infrastructure/persistence/repositories/proof-of-delivery.repository.js';
import { CreateProofOfDeliveryUseCase } from './application/use-cases/create-proof-of-delivery.use-case.js';
import { GetProofOfDeliveryUseCase } from './application/use-cases/get-proof-of-delivery.use-case.js';
import { ListProofsOfDeliveryUseCase } from './application/use-cases/list-proofs-of-delivery.use-case.js';
import { MarkProofObservedUseCase } from './application/use-cases/mark-proof-observed.use-case.js';
import { MarkProofRejectedUseCase } from './application/use-cases/mark-proof-rejected.use-case.js';
import { DeliveryProofsController } from './presentation/http/controllers/delivery-proofs.controller.js';

@Module({
  imports: [ShipmentsModule],
  controllers: [DeliveryProofsController],
  providers: [
    ProofOfDeliveryRepository,
    { provide: PROOF_OF_DELIVERY_REPOSITORY, useExisting: ProofOfDeliveryRepository },
    CreateProofOfDeliveryUseCase,
    GetProofOfDeliveryUseCase,
    ListProofsOfDeliveryUseCase,
    MarkProofObservedUseCase,
    MarkProofRejectedUseCase,
  ],
  exports: [PROOF_OF_DELIVERY_REPOSITORY],
})
export class DeliveryProofsModule {}
