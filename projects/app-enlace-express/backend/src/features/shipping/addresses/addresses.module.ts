import { Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module.js';
import { ADDRESS_REPOSITORY } from './domain/interfaces/address-repository.interface.js';
import { AddressRepository } from './infrastructure/persistence/repositories/address.repository.js';
import { CreateAddressUseCase } from './application/use-cases/create-address.use-case.js';
import { UpdateAddressUseCase } from './application/use-cases/update-address.use-case.js';
import { DeleteAddressUseCase } from './application/use-cases/delete-address.use-case.js';
import { GetAddressUseCase } from './application/use-cases/get-address.use-case.js';
import { ListAddressesUseCase } from './application/use-cases/list-addresses.use-case.js';
import { AddressesController } from './presentation/http/controllers/addresses.controller.js';

@Module({
  imports: [CompaniesModule],
  controllers: [AddressesController],
  providers: [
    AddressRepository,
    { provide: ADDRESS_REPOSITORY, useExisting: AddressRepository },
    CreateAddressUseCase,
    UpdateAddressUseCase,
    DeleteAddressUseCase,
    GetAddressUseCase,
    ListAddressesUseCase,
  ],
  exports: [ADDRESS_REPOSITORY],
})
export class AddressesModule {}
