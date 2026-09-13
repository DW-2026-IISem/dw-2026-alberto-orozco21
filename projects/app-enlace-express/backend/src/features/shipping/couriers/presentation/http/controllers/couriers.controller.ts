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
import { CreateCourierDto } from '../../../application/dto/create-courier.dto.js';
import { UpdateCourierDto } from '../../../application/dto/update-courier.dto.js';
import { CourierFilterDto } from '../../../application/dto/courier-filter.dto.js';
import { CourierResponseDto } from '../../../application/dto/courier-response.dto.js';
import { CreateCourierUseCase } from '../../../application/use-cases/create-courier.use-case.js';
import { UpdateCourierUseCase } from '../../../application/use-cases/update-courier.use-case.js';
import { DeleteCourierUseCase } from '../../../application/use-cases/delete-courier.use-case.js';
import { GetCourierUseCase } from '../../../application/use-cases/get-courier.use-case.js';
import { ListCouriersUseCase } from '../../../application/use-cases/list-couriers.use-case.js';

@ApiTags('Couriers')
@Controller('couriers')
export class CouriersController {
  constructor(
    private readonly createCourierUseCase: CreateCourierUseCase,
    private readonly updateCourierUseCase: UpdateCourierUseCase,
    private readonly deleteCourierUseCase: DeleteCourierUseCase,
    private readonly getCourierUseCase: GetCourierUseCase,
    private readonly listCouriersUseCase: ListCouriersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un mensajero' })
  @ApiCreatedResponse({ type: CourierResponseDto })
  create(@Body() dto: CreateCourierDto) {
    return this.createCourierUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mensajeros' })
  @ApiOkResponse({ type: [CourierResponseDto] })
  findAll(@Query() filter: CourierFilterDto) {
    return this.listCouriersUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un mensajero por ID' })
  @ApiOkResponse({ type: CourierResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getCourierUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un mensajero' })
  @ApiOkResponse({ type: CourierResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateCourierDto,
  ) {
    return this.updateCourierUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un mensajero' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteCourierUseCase.execute(id);
  }
}
