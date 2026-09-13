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
import { CreateRateDto } from '../../../application/dto/create-rate.dto.js';
import { UpdateRateDto } from '../../../application/dto/update-rate.dto.js';
import { RateFilterDto } from '../../../application/dto/rate-filter.dto.js';
import { RateResponseDto } from '../../../application/dto/rate-response.dto.js';
import { CreateRateUseCase } from '../../../application/use-cases/create-rate.use-case.js';
import { UpdateRateUseCase } from '../../../application/use-cases/update-rate.use-case.js';
import { DeleteRateUseCase } from '../../../application/use-cases/delete-rate.use-case.js';
import { GetRateUseCase } from '../../../application/use-cases/get-rate.use-case.js';
import { ListRatesUseCase } from '../../../application/use-cases/list-rates.use-case.js';

@ApiTags('Rates')
@Controller('rates')
export class RatesController {
  constructor(
    private readonly createRateUseCase: CreateRateUseCase,
    private readonly updateRateUseCase: UpdateRateUseCase,
    private readonly deleteRateUseCase: DeleteRateUseCase,
    private readonly getRateUseCase: GetRateUseCase,
    private readonly listRatesUseCase: ListRatesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una tarifa' })
  @ApiCreatedResponse({ type: RateResponseDto })
  create(@Body() dto: CreateRateDto) {
    return this.createRateUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tarifas' })
  @ApiOkResponse({ type: [RateResponseDto] })
  findAll(@Query() filter: RateFilterDto) {
    return this.listRatesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una tarifa por ID' })
  @ApiOkResponse({ type: RateResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getRateUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una tarifa' })
  @ApiOkResponse({ type: RateResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateRateDto,
  ) {
    return this.updateRateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una tarifa' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteRateUseCase.execute(id);
  }
}
