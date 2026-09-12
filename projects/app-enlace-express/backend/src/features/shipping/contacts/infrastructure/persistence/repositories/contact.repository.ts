import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Contact } from '../../../domain/entities/contact.entity.js';
import {
  ContactFindAllParams,
  IContactRepository,
} from '../../../domain/interfaces/contact-repository.interface.js';
import { ContactMapper } from '../../../application/mappers/contact.mapper.js';
import { ContactModel } from '../models/contact.model.js';

@Injectable()
export class ContactRepository implements IContactRepository {
  async create(contact: Contact): Promise<Contact> {
    const model = await ContactModel.create(
      ContactMapper.toPersistence(contact),
    );
    return ContactMapper.toDomain(model);
  }

  async update(contact: Contact): Promise<Contact> {
    await ContactModel.update(ContactMapper.toPersistence(contact), {
      where: { id: contact.id },
    });
    const updated = await ContactModel.findByPk(contact.id!);
    return ContactMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ContactModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Contact | null> {
    const model = await ContactModel.findByPk(id);
    return model ? ContactMapper.toDomain(model) : null;
  }

  async findAll(params: ContactFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};

    if (params.companyId) {
      where.companyId = params.companyId;
    }

    if (params.search) {
      where[Op.or as unknown as string] = [
        { name: { [Op.like]: `%${params.search}%` } },
        { email: { [Op.like]: `%${params.search}%` } },
      ];
    }

    const { rows, count } = await ContactModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ContactMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }

  async clearPrimaryFlag(companyId: number, excludeId?: number): Promise<void> {
    const where: Record<string, unknown> = { companyId, isPrimary: true };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    await ContactModel.update({ isPrimary: false }, { where });
  }
}
