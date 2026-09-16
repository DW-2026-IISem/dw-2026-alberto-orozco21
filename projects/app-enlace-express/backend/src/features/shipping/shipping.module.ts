import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { AddressesModule } from './addresses/addresses.module.js';
import { RatesModule } from './rates/rates.module.js';
import { CouriersModule } from './couriers/couriers.module.js';
import { RoutesModule } from './routes/routes.module.js';
import { InvoicesModule } from './invoices/invoices.module.js';
import { ShipmentsModule } from './shipments/shipments.module.js';
import { PackagesModule } from './packages/packages.module.js';
import { TrackingEventsModule } from './tracking-events/tracking-events.module.js';
import { DeliveryProofsModule } from './delivery-proofs/delivery-proofs.module.js';

@Module({
  imports: [
    CompaniesModule,
    ContactsModule,
    AddressesModule,
    RatesModule,
    CouriersModule,
    RoutesModule,
    InvoicesModule,
    ShipmentsModule,
    PackagesModule,
    TrackingEventsModule,
    DeliveryProofsModule,
  ],
  exports: [
    CompaniesModule,
    ContactsModule,
    AddressesModule,
    RatesModule,
    CouriersModule,
    RoutesModule,
    InvoicesModule,
    ShipmentsModule,
    PackagesModule,
    TrackingEventsModule,
    DeliveryProofsModule,
  ],
})
export class ShippingModule {}
