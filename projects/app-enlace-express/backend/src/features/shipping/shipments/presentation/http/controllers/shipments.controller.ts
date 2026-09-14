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
import { CreateShipmentDto } from '../../../application/dto/create-shipment.dto.js';
import { UpdateShipmentDto } from '../../../application/dto/update-shipment.dto.js';
import { AssignShipmentDto } from '../../../application/dto/assign-shipment.dto.js';
import { ShipmentFilterDto } from '../../../application/dto/shipment-filter.dto.js';
import { ShipmentResponseDto } from '../../../application/dto/shipment-response.dto.js';
import { CreateShipmentUseCase } from '../../../application/use-cases/create-shipment.use-case.js';
import { UpdateShipmentUseCase } from '../../../application/use-cases/update-shipment.use-case.js';
import { DeleteShipmentUseCase } from '../../../application/use-cases/delete-shipment.use-case.js';
import { GetShipmentUseCase } from '../../../application/use-cases/get-shipment.use-case.js';
import { ListShipmentsUseCase } from '../../../application/use-cases/list-shipments.use-case.js';
import { QuoteShipmentUseCase } from '../../../application/use-cases/quote-shipment.use-case.js';
import { AssignShipmentUseCase } from '../../../application/use-cases/assign-shipment.use-case.js';
import { StartTransitShipmentUseCase } from '../../../application/use-cases/start-transit-shipment.use-case.js';
import { ReportShipmentIssueUseCase } from '../../../application/use-cases/report-shipment-issue.use-case.js';
import { DeliverShipmentUseCase } from '../../../application/use-cases/deliver-shipment.use-case.js';
import { CancelShipmentUseCase } from '../../../application/use-cases/cancel-shipment.use-case.js';

@ApiTags('Shipments')
@Controller('shipments')
export class ShipmentsController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly updateShipmentUseCase: UpdateShipmentUseCase,
    private readonly deleteShipmentUseCase: DeleteShipmentUseCase,
    private readonly getShipmentUseCase: GetShipmentUseCase,
    private readonly listShipmentsUseCase: ListShipmentsUseCase,
    private readonly quoteShipmentUseCase: QuoteShipmentUseCase,
    private readonly assignShipmentUseCase: AssignShipmentUseCase,
    private readonly startTransitShipmentUseCase: StartTransitShipmentUseCase,
    private readonly reportShipmentIssueUseCase: ReportShipmentIssueUseCase,
    private readonly deliverShipmentUseCase: DeliverShipmentUseCase,
    private readonly cancelShipmentUseCase: CancelShipmentUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un envío' })
  @ApiCreatedResponse({ type: ShipmentResponseDto })
  create(@Body() dto: CreateShipmentDto) {
    return this.createShipmentUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar envíos' })
  @ApiOkResponse({ type: [ShipmentResponseDto] })
  findAll(@Query() filter: ShipmentFilterDto) {
    return this.listShipmentsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un envío por ID' })
  @ApiOkResponse({ type: ShipmentResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getShipmentUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos comerciales (solo si está creado)' })
  @ApiOkResponse({ type: ShipmentResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateShipmentDto,
  ) {
    return this.updateShipmentUseCase.execute(id, dto);
  }

  @Patch(':id/quote')
  @ApiOperation({ summary: 'Cotizar el envío (creado → cotizado)' })
  @ApiOkResponse({ type: ShipmentResponseDto })
  quote(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.quoteShipmentUseCase.execute(id);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Asignar mensajero y ruta (cotizado → asignado)' })
  @ApiOkResponse({ type: ShipmentResponseDto })
  assign(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: AssignShipmentDto,
  ) {
    return this.assignShipmentUseCase.execute(id, dto);
  }

  @Patch(':id/start-transit')
  @ApiOperation({ summary: 'Poner en ruta (asignado/con_novedad → en_ruta)' })
  @ApiOkResponse({ type: ShipmentResponseDto })
  startTransit(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.startTransitShipmentUseCase.execute(id);
  }

  @Patch(':id/report-issue')
  @ApiOperation({ summary: 'Reportar novedad (en_ruta → con_novedad)' })
  @ApiOkResponse({ type: ShipmentResponseDto })
  reportIssue(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.reportShipmentIssueUseCase.execute(id);
  }

  @Patch(':id/deliver')
  @ApiOperation({ summary: 'Marcar como entregado (en_ruta → entregado)' })
  @ApiOkResponse({ type: ShipmentResponseDto })
  deliver(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deliverShipmentUseCase.execute(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancelar el envío' })
  @ApiOkResponse({ type: ShipmentResponseDto })
  cancel(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.cancelShipmentUseCase.execute(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un envío recién creado' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteShipmentUseCase.execute(id);
  }
}
