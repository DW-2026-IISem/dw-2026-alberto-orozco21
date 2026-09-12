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
import { CreateContactDto } from '../../../application/dto/create-contact.dto.js';
import { UpdateContactDto } from '../../../application/dto/update-contact.dto.js';
import { ContactFilterDto } from '../../../application/dto/contact-filter.dto.js';
import { ContactResponseDto } from '../../../application/dto/contact-response.dto.js';
import { CreateContactUseCase } from '../../../application/use-cases/create-contact.use-case.js';
import { UpdateContactUseCase } from '../../../application/use-cases/update-contact.use-case.js';
import { DeleteContactUseCase } from '../../../application/use-cases/delete-contact.use-case.js';
import { GetContactUseCase } from '../../../application/use-cases/get-contact.use-case.js';
import { ListContactsUseCase } from '../../../application/use-cases/list-contacts.use-case.js';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly updateContactUseCase: UpdateContactUseCase,
    private readonly deleteContactUseCase: DeleteContactUseCase,
    private readonly getContactUseCase: GetContactUseCase,
    private readonly listContactsUseCase: ListContactsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un contacto' })
  @ApiCreatedResponse({ type: ContactResponseDto })
  create(@Body() dto: CreateContactDto) {
    return this.createContactUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar contactos (opcionalmente por empresa)' })
  @ApiOkResponse({ type: [ContactResponseDto] })
  findAll(@Query() filter: ContactFilterDto) {
    return this.listContactsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un contacto por ID' })
  @ApiOkResponse({ type: ContactResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getContactUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un contacto' })
  @ApiOkResponse({ type: ContactResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateContactDto,
  ) {
    return this.updateContactUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un contacto' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteContactUseCase.execute(id);
  }
}
