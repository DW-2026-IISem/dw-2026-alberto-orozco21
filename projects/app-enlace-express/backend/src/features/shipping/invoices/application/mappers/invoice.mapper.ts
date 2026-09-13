import { Invoice } from '../../domain/entities/invoice.entity.js';
import { InvoiceResponseDto } from '../dto/invoice-response.dto.js';
import { InvoiceModel } from '../../infrastructure/persistence/models/invoice.model.js';

export class InvoiceMapper {
  static toDomain(model: InvoiceModel): Invoice {
    return Invoice.reconstitute({
      id: model.id,
      companyId: model.companyId,
      number: model.number,
      periodStart: new Date(model.periodStart),
      periodEnd: new Date(model.periodEnd),
      issueDate: new Date(model.issueDate),
      subtotal: Number(model.subtotal),
      taxes: Number(model.taxes),
      total: Number(model.total),
      status: model.status,
      paymentDate: model.paymentDate ?? undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Invoice): InvoiceResponseDto {
    return {
      id: entity.id!,
      companyId: entity.companyId,
      number: entity.number,
      periodStart: entity.periodStart,
      periodEnd: entity.periodEnd,
      issueDate: entity.issueDate,
      subtotal: entity.subtotal,
      taxes: entity.taxes,
      total: entity.total,
      status: entity.status,
      paymentDate: entity.paymentDate,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Invoice): Partial<InvoiceModel> {
    return {
      id: entity.id,
      companyId: entity.companyId,
      number: entity.number,
      periodStart: entity.periodStart.toISOString().slice(0, 10) as any,
      periodEnd: entity.periodEnd.toISOString().slice(0, 10) as any,
      issueDate: entity.issueDate.toISOString().slice(0, 10) as any,
      subtotal: entity.subtotal,
      taxes: entity.taxes,
      total: entity.total,
      status: entity.status,
      paymentDate: entity.paymentDate ?? null,
    };
  }
}
