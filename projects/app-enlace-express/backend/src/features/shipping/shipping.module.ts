import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { AddressesModule } from './addresses/addresses.module.js';
import { RatesModule } from './rates/rates.module.js';
import { CouriersModule } from './couriers/couriers.module.js';
import { RoutesModule } from './routes/routes.module.js';
import { InvoicesModule } from './invoices/invoices.module.js';
import { ShipmentsModule } from './shipments/shipments.module.js';

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
  ],
})
export class ShippingModule {}
