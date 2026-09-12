import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module.js';

@Module({
  imports: [CompaniesModule],
  exports: [CompaniesModule],
})
export class ShippingModule {}
