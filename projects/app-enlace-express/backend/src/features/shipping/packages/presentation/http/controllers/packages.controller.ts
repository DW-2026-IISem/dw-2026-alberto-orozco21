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
import { CreatePackageDto } from '../../../application/dto/create-package.dto.js';
import { UpdatePackageDto } from '../../../application/dto/update-package.dto.js';
import { PackageFilterDto } from '../../../application/dto/package-filter.dto.js';
import { PackageResponseDto } from '../../../application/dto/package-response.dto.js';
import { CreatePackageUseCase } from '../../../application/use-cases/create-package.use-case.js';
import { UpdatePackageUseCase } from '../../../application/use-cases/update-package.use-case.js';
import { DeletePackageUseCase } from '../../../application/use-cases/delete-package.use-case.js';
import { GetPackageUseCase } from '../../../application/use-cases/get-package.use-case.js';
import { ListPackagesUseCase } from '../../../application/use-cases/list-packages.use-case.js';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
  constructor(
    private readonly createPackageUseCase: CreatePackageUseCase,
    private readonly updatePackageUseCase: UpdatePackageUseCase,
    private readonly deletePackageUseCase: DeletePackageUseCase,
    private readonly getPackageUseCase: GetPackageUseCase,
    private readonly listPackagesUseCase: ListPackagesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Agregar un paquete a un envío' })
  @ApiCreatedResponse({ type: PackageResponseDto })
  create(@Body() dto: CreatePackageDto) {
    return this.createPackageUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar paquetes (opcionalmente por envío)' })
  @ApiOkResponse({ type: [PackageResponseDto] })
  findAll(@Query() filter: PackageFilterDto) {
    return this.listPackagesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un paquete por ID' })
  @ApiOkResponse({ type: PackageResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getPackageUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un paquete (solo si el envío sigue creado)' })
  @ApiOkResponse({ type: PackageResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdatePackageDto,
  ) {
    return this.updatePackageUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un paquete (solo si el envío sigue creado)' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deletePackageUseCase.execute(id);
  }
}
