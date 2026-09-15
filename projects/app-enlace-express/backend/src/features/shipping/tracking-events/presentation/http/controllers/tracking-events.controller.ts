import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../../../../../../common/pipes/parse-positive-int.pipe.js';
import { CreateTrackingEventDto } from '../../../application/dto/create-tracking-event.dto.js';
import { TrackingEventFilterDto } from '../../../application/dto/tracking-event-filter.dto.js';
import { TrackingEventResponseDto } from '../../../application/dto/tracking-event-response.dto.js';
import { CreateTrackingEventUseCase } from '../../../application/use-cases/create-tracking-event.use-case.js';
import { GetTrackingEventUseCase } from '../../../application/use-cases/get-tracking-event.use-case.js';
import { ListTrackingEventsUseCase } from '../../../application/use-cases/list-tracking-events.use-case.js';

@ApiTags('TrackingEvents')
@Controller('tracking-events')
export class TrackingEventsController {
  constructor(
    private readonly createTrackingEventUseCase: CreateTrackingEventUseCase,
    private readonly getTrackingEventUseCase: GetTrackingEventUseCase,
    private readonly listTrackingEventsUseCase: ListTrackingEventsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un evento de tracking' })
  @ApiCreatedResponse({ type: TrackingEventResponseDto })
  create(@Body() dto: CreateTrackingEventDto) {
    return this.createTrackingEventUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar eventos de tracking (opcionalmente por envío)' })
  @ApiOkResponse({ type: [TrackingEventResponseDto] })
  findAll(@Query() filter: TrackingEventFilterDto) {
    return this.listTrackingEventsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento de tracking por ID' })
  @ApiOkResponse({ type: TrackingEventResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getTrackingEventUseCase.execute(id);
  }
}
