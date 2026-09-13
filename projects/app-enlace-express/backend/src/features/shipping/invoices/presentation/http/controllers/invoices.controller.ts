import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../../../../../../common/pipes/parse-positive-int.pipe.js';
import { CreateInvoiceDto } from '../../../application/dto/create-invoice.dto.js';
import { UpdateInvoiceDto } from '../../../application/dto/update-invoice.dto.js';
import { MarkInvoicePaidDto } from '../../../application/dto/mark-invoice-paid.dto.js';
import { InvoiceFilterDto } from '../../../application/dto/invoice-filter.dto.js';
import { InvoiceResponseDto } from '../../../application/dto/invoice-response.dto.js';
import { CreateInvoiceUseCase } from '../../../application/use-cases/create-invoice.use-case.js';
import { UpdateInvoiceUseCase } from '../../../application/use-cases/update-invoice.use-case.js';
import { DeleteInvoiceUseCase } from '../../../application/use-cases/delete-invoice.use-case.js';
import { GetInvoiceUseCase } from '../../../application/use-cases/get-invoice.use-case.js';
import { ListInvoicesUseCase } from '../../../application/use-cases/list-invoices.use-case.js';
import { MarkInvoicePaidUseCase } from '../../../application/use-cases/mark-invoice-paid.use-case.js';
import { VoidInvoiceUseCase } from '../../../application/use-cases/void-invoice.use-case.js';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly updateInvoiceUseCase: UpdateInvoiceUseCase,
    private readonly deleteInvoiceUseCase: DeleteInvoiceUseCase,
    private readonly getInvoiceUseCase: GetInvoiceUseCase,
    private readonly listInvoicesUseCase: ListInvoicesUseCase,
    private readonly markInvoicePaidUseCase: MarkInvoicePaidUseCase,
    private readonly voidInvoiceUseCase: VoidInvoiceUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una factura' })
  @ApiCreatedResponse({ type: InvoiceResponseDto })
  create(@Body() dto: CreateInvoiceDto) {
    return this.createInvoiceUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar facturas (opcionalmente por empresa o estado)' })
  @ApiOkResponse({ type: [InvoiceResponseDto] })
  findAll(@Query() filter: InvoiceFilterDto) {
    return this.listInvoicesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  @ApiOkResponse({ type: InvoiceResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getInvoiceUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una factura pendiente' })
  @ApiOkResponse({ type: InvoiceResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateInvoiceDto,
  ) {
    return this.updateInvoiceUseCase.execute(id, dto);
  }

  @Patch(':id/pay')
  @ApiOperation({ summary: 'Marcar una factura como pagada' })
  @ApiOkResponse({ type: InvoiceResponseDto })
  markAsPaid(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: MarkInvoicePaidDto,
  ) {
    return this.markInvoicePaidUseCase.execute(id, dto);
  }

  @Patch(':id/void')
  @ApiOperation({ summary: 'Anular una factura' })
  @ApiOkResponse({ type: InvoiceResponseDto })
  void(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.voidInvoiceUseCase.execute(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una factura (no pagada)' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteInvoiceUseCase.execute(id);
  }
}
