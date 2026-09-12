import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module.js';
import { ContactsModule } from './contacts/contacts.module.js';

@Module({
  imports: [CompaniesModule, ContactsModule],
  exports: [CompaniesModule, ContactsModule],
})
export class ShippingModule {}
