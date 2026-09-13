import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { AddressesModule } from './addresses/addresses.module.js';

@Module({
  imports: [CompaniesModule, ContactsModule, AddressesModule],
  exports: [CompaniesModule, ContactsModule, AddressesModule],
})
export class ShippingModule {}
