import { Injectable } from '@nestjs/common';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { ProofOfDelivery } from '../../../domain/entities/proof-of-delivery.entity.js';
import {
  ProofOfDeliveryFindAllParams,
  IProofOfDeliveryRepository,
} from '../../../domain/interfaces/proof-of-delivery-repository.interface.js';
import { ProofOfDeliveryMapper } from '../../../application/mappers/proof-of-delivery.mapper.js';
import { ProofOfDeliveryModel } from '../models/proof-of-delivery.model.js';

@Injectable()
export class ProofOfDeliveryRepository implements IProofOfDeliveryRepository {
  async create(proof: ProofOfDelivery): Promise<ProofOfDelivery> {
    const model = await ProofOfDeliveryModel.create(
      ProofOfDeliveryMapper.toPersistence(proof),
    );
    return ProofOfDeliveryMapper.toDomain(model);
  }

  async update(proof: ProofOfDelivery): Promise<ProofOfDelivery> {
    await ProofOfDeliveryModel.update(ProofOfDeliveryMapper.toPersistence(proof), {
      where: { id: proof.id },
    });
    const updated = await ProofOfDeliveryModel.findByPk(proof.id!);
    return ProofOfDeliveryMapper.toDomain(updated!);
  }

  async findById(id: number): Promise<ProofOfDelivery | null> {
    const model = await ProofOfDeliveryModel.findByPk(id);
    return model ? ProofOfDeliveryMapper.toDomain(model) : null;
  }

  async findByShipmentId(shipmentId: number): Promise<ProofOfDelivery | null> {
    const model = await ProofOfDeliveryModel.findOne({ where: { shipmentId } });
    return model ? ProofOfDeliveryMapper.toDomain(model) : null;
  }

  async findAll(params: ProofOfDeliveryFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const { rows, count } = await ProofOfDeliveryModel.findAndCountAll({
      limit,
      offset,
      order: [['deliveredAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ProofOfDeliveryMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
