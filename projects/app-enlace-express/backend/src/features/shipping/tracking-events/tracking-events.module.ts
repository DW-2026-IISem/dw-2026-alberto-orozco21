import { Module } from '@nestjs/common';
import { ShipmentsModule } from '../shipments/shipments.module.js';
import { CouriersModule } from '../couriers/couriers.module.js';
import { TRACKING_EVENT_REPOSITORY } from './domain/interfaces/tracking-event-repository.interface.js';
import { TrackingEventRepository } from './infrastructure/persistence/repositories/tracking-event.repository.js';
import { CreateTrackingEventUseCase } from './application/use-cases/create-tracking-event.use-case.js';
import { GetTrackingEventUseCase } from './application/use-cases/get-tracking-event.use-case.js';
import { ListTrackingEventsUseCase } from './application/use-cases/list-tracking-events.use-case.js';
import { TrackingEventsController } from './presentation/http/controllers/tracking-events.controller.js';

@Module({
  imports: [ShipmentsModule, CouriersModule],
  controllers: [TrackingEventsController],
  providers: [
    TrackingEventRepository,
    { provide: TRACKING_EVENT_REPOSITORY, useExisting: TrackingEventRepository },
    CreateTrackingEventUseCase,
    GetTrackingEventUseCase,
    ListTrackingEventsUseCase,
  ],
  exports: [TRACKING_EVENT_REPOSITORY],
})
export class TrackingEventsModule {}
