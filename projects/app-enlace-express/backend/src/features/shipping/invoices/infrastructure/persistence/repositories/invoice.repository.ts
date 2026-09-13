import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Invoice } from '../../../domain/entities/invoice.entity.js';
import {
  InvoiceFindAllParams,
  IInvoiceRepository,
} from '../../../domain/interfaces/invoice-repository.interface.js';
import { InvoiceMapper } from '../../../application/mappers/invoice.mapper.js';
import { InvoiceModel } from '../models/invoice.model.js';

@Injectable()
export class InvoiceRepository implements IInvoiceRepository {
  async create(invoice: Invoice): Promise<Invoice> {
    const model = await InvoiceModel.create(
      InvoiceMapper.toPersistence(invoice),
    );
    return InvoiceMapper.toDomain(model);
  }

  async update(invoice: Invoice): Promise<Invoice> {
    await InvoiceModel.update(InvoiceMapper.toPersistence(invoice), {
      where: { id: invoice.id },
    });
    const updated = await InvoiceModel.findByPk(invoice.id!);
    return InvoiceMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await InvoiceModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Invoice | null> {
    const model = await InvoiceModel.findByPk(id);
    return model ? InvoiceMapper.toDomain(model) : null;
  }

  async findByNumber(number: string): Promise<Invoice | null> {
    const model = await InvoiceModel.findOne({ where: { number } });
    return model ? InvoiceMapper.toDomain(model) : null;
  }

  async findAll(params: InvoiceFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};

    if (params.companyId) {
      where.companyId = params.companyId;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where[Op.or as unknown as string] = [
        { number: { [Op.like]: `%${params.search}%` } },
      ];
    }

    const { rows, count } = await InvoiceModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['issueDate', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => InvoiceMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
