import { Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module.js';
import { ContactsModule } from '../contacts/contacts.module.js';
import { AddressesModule } from '../addresses/addresses.module.js';
import { RatesModule } from '../rates/rates.module.js';
import { CouriersModule } from '../couriers/couriers.module.js';
import { RoutesModule } from '../routes/routes.module.js';
import { SHIPMENT_REPOSITORY } from './domain/interfaces/shipment-repository.interface.js';
import { ShipmentRepository } from './infrastructure/persistence/repositories/shipment.repository.js';
import { CreateShipmentUseCase } from './application/use-cases/create-shipment.use-case.js';
import { UpdateShipmentUseCase } from './application/use-cases/update-shipment.use-case.js';
import { DeleteShipmentUseCase } from './application/use-cases/delete-shipment.use-case.js';
import { GetShipmentUseCase } from './application/use-cases/get-shipment.use-case.js';
import { ListShipmentsUseCase } from './application/use-cases/list-shipments.use-case.js';
import { QuoteShipmentUseCase } from './application/use-cases/quote-shipment.use-case.js';
import { AssignShipmentUseCase } from './application/use-cases/assign-shipment.use-case.js';
import { StartTransitShipmentUseCase } from './application/use-cases/start-transit-shipment.use-case.js';
import { ReportShipmentIssueUseCase } from './application/use-cases/report-shipment-issue.use-case.js';
import { CancelShipmentUseCase } from './application/use-cases/cancel-shipment.use-case.js';
import { ShipmentsController } from './presentation/http/controllers/shipments.controller.js';

@Module({
  imports: [
    CompaniesModule,
    ContactsModule,
    AddressesModule,
    RatesModule,
    CouriersModule,
    RoutesModule,
  ],
  controllers: [ShipmentsController],
  providers: [
    ShipmentRepository,
    { provide: SHIPMENT_REPOSITORY, useExisting: ShipmentRepository },
    CreateShipmentUseCase,
    UpdateShipmentUseCase,
    DeleteShipmentUseCase,
    GetShipmentUseCase,
    ListShipmentsUseCase,
    QuoteShipmentUseCase,
    AssignShipmentUseCase,
    StartTransitShipmentUseCase,
    ReportShipmentIssueUseCase,
    CancelShipmentUseCase,
  ],
  exports: [SHIPMENT_REPOSITORY],
})
export class ShipmentsModule {}
