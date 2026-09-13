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
import { CreateRouteDto } from '../../../application/dto/create-route.dto.js';
import { UpdateRouteDto } from '../../../application/dto/update-route.dto.js';
import { RouteFilterDto } from '../../../application/dto/route-filter.dto.js';
import { RouteResponseDto } from '../../../application/dto/route-response.dto.js';
import { CreateRouteUseCase } from '../../../application/use-cases/create-route.use-case.js';
import { UpdateRouteUseCase } from '../../../application/use-cases/update-route.use-case.js';
import { DeleteRouteUseCase } from '../../../application/use-cases/delete-route.use-case.js';
import { GetRouteUseCase } from '../../../application/use-cases/get-route.use-case.js';
import { ListRoutesUseCase } from '../../../application/use-cases/list-routes.use-case.js';

@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
  constructor(
    private readonly createRouteUseCase: CreateRouteUseCase,
    private readonly updateRouteUseCase: UpdateRouteUseCase,
    private readonly deleteRouteUseCase: DeleteRouteUseCase,
    private readonly getRouteUseCase: GetRouteUseCase,
    private readonly listRoutesUseCase: ListRoutesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una ruta' })
  @ApiCreatedResponse({ type: RouteResponseDto })
  create(@Body() dto: CreateRouteDto) {
    return this.createRouteUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar rutas (opcionalmente por mensajero o estado)' })
  @ApiOkResponse({ type: [RouteResponseDto] })
  findAll(@Query() filter: RouteFilterDto) {
    return this.listRoutesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ruta por ID' })
  @ApiOkResponse({ type: RouteResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getRouteUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una ruta' })
  @ApiOkResponse({ type: RouteResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateRouteDto,
  ) {
    return this.updateRouteUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una ruta' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteRouteUseCase.execute(id);
  }
}
