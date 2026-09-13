import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { AddressesModule } from './addresses/addresses.module.js';
import { RatesModule } from './rates/rates.module.js';

@Module({
  imports: [CompaniesModule, ContactsModule, AddressesModule, RatesModule],
  exports: [CompaniesModule, ContactsModule, AddressesModule, RatesModule],
})
export class ShippingModule {}
