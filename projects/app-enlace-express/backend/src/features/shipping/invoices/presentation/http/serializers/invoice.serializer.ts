import { Invoice } from '../../../domain/entities/invoice.entity.js';
import { InvoiceResponseDto } from '../../../application/dto/invoice-response.dto.js';
import { InvoiceMapper } from '../../../application/mappers/invoice.mapper.js';

export class InvoiceSerializer {
  static serialize(entity: Invoice): InvoiceResponseDto {
    return InvoiceMapper.toResponse(entity);
  }
}
