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
import { CreateAddressDto } from '../../../application/dto/create-address.dto.js';
import { UpdateAddressDto } from '../../../application/dto/update-address.dto.js';
import { AddressFilterDto } from '../../../application/dto/address-filter.dto.js';
import { AddressResponseDto } from '../../../application/dto/address-response.dto.js';
import { CreateAddressUseCase } from '../../../application/use-cases/create-address.use-case.js';
import { UpdateAddressUseCase } from '../../../application/use-cases/update-address.use-case.js';
import { DeleteAddressUseCase } from '../../../application/use-cases/delete-address.use-case.js';
import { GetAddressUseCase } from '../../../application/use-cases/get-address.use-case.js';
import { ListAddressesUseCase } from '../../../application/use-cases/list-addresses.use-case.js';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
    private readonly deleteAddressUseCase: DeleteAddressUseCase,
    private readonly getAddressUseCase: GetAddressUseCase,
    private readonly listAddressesUseCase: ListAddressesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una dirección' })
  @ApiCreatedResponse({ type: AddressResponseDto })
  create(@Body() dto: CreateAddressDto) {
    return this.createAddressUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar direcciones (opcionalmente por empresa o tipo)' })
  @ApiOkResponse({ type: [AddressResponseDto] })
  findAll(@Query() filter: AddressFilterDto) {
    return this.listAddressesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una dirección por ID' })
  @ApiOkResponse({ type: AddressResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getAddressUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una dirección' })
  @ApiOkResponse({ type: AddressResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.updateAddressUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una dirección' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteAddressUseCase.execute(id);
  }
}
