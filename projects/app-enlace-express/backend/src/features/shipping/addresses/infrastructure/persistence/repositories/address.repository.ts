import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Address } from '../../../domain/entities/address.entity.js';
import {
  AddressFindAllParams,
  IAddressRepository,
} from '../../../domain/interfaces/address-repository.interface.js';
import { AddressMapper } from '../../../application/mappers/address.mapper.js';
import { AddressModel } from '../models/address.model.js';

@Injectable()
export class AddressRepository implements IAddressRepository {
  async create(address: Address): Promise<Address> {
    const model = await AddressModel.create(
      AddressMapper.toPersistence(address),
    );
    return AddressMapper.toDomain(model);
  }

  async update(address: Address): Promise<Address> {
    await AddressModel.update(AddressMapper.toPersistence(address), {
      where: { id: address.id },
    });
    const updated = await AddressModel.findByPk(address.id!);
    return AddressMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await AddressModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Address | null> {
    const model = await AddressModel.findByPk(id);
    return model ? AddressMapper.toDomain(model) : null;
  }

  async findAll(params: AddressFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};

    if (params.companyId) {
      where.companyId = params.companyId;
    }

    if (params.type) {
      where.type = params.type;
    }

    if (params.search) {
      where[Op.or as unknown as string] = [
        { alias: { [Op.like]: `%${params.search}%` } },
        { city: { [Op.like]: `%${params.search}%` } },
        { addressLine1: { [Op.like]: `%${params.search}%` } },
      ];
    }

    if (!params.includeInactive) {
      where.isActive = true;
    }  

    const { rows, count } = await AddressModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => AddressMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
