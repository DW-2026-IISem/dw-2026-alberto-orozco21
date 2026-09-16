import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../../../../../../common/pipes/parse-positive-int.pipe.js';
import { CreateProofOfDeliveryDto } from '../../../application/dto/create-proof-of-delivery.dto.js';
import { ReviewProofOfDeliveryDto } from '../../../application/dto/review-proof-of-delivery.dto.js';
import { ProofOfDeliveryFilterDto } from '../../../application/dto/proof-of-delivery-filter.dto.js';
import { ProofOfDeliveryResponseDto } from '../../../application/dto/proof-of-delivery-response.dto.js';
import { CreateProofOfDeliveryUseCase } from '../../../application/use-cases/create-proof-of-delivery.use-case.js';
import { GetProofOfDeliveryUseCase } from '../../../application/use-cases/get-proof-of-delivery.use-case.js';
import { ListProofsOfDeliveryUseCase } from '../../../application/use-cases/list-proofs-of-delivery.use-case.js';
import { MarkProofObservedUseCase } from '../../../application/use-cases/mark-proof-observed.use-case.js';
import { MarkProofRejectedUseCase } from '../../../application/use-cases/mark-proof-rejected.use-case.js';

@ApiTags('DeliveryProofs')
@Controller('delivery-proofs')
export class DeliveryProofsController {
  constructor(
    private readonly createProofOfDeliveryUseCase: CreateProofOfDeliveryUseCase,
    private readonly getProofOfDeliveryUseCase: GetProofOfDeliveryUseCase,
    private readonly listProofsOfDeliveryUseCase: ListProofsOfDeliveryUseCase,
    private readonly markProofObservedUseCase: MarkProofObservedUseCase,
    private readonly markProofRejectedUseCase: MarkProofRejectedUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Registrar evidencia de entrega (entrega el envío: en_ruta → entregado)',
  })
  @ApiCreatedResponse({ type: ProofOfDeliveryResponseDto })
  create(@Body() dto: CreateProofOfDeliveryDto) {
    return this.createProofOfDeliveryUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pruebas de entrega' })
  @ApiOkResponse({ type: [ProofOfDeliveryResponseDto] })
  findAll(@Query() filter: ProofOfDeliveryFilterDto) {
    return this.listProofsOfDeliveryUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una prueba de entrega por ID' })
  @ApiOkResponse({ type: ProofOfDeliveryResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getProofOfDeliveryUseCase.execute(id);
  }

  @Patch(':id/observe')
  @ApiOperation({ summary: 'Marcar una prueba de entrega como observada' })
  @ApiOkResponse({ type: ProofOfDeliveryResponseDto })
  observe(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: ReviewProofOfDeliveryDto,
  ) {
    return this.markProofObservedUseCase.execute(id, dto);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Rechazar una prueba de entrega' })
  @ApiOkResponse({ type: ProofOfDeliveryResponseDto })
  reject(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: ReviewProofOfDeliveryDto,
  ) {
    return this.markProofRejectedUseCase.execute(id, dto);
  }
}
