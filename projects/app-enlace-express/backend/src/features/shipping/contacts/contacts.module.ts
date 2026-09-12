import { Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module.js';
import { CONTACT_REPOSITORY } from './domain/interfaces/contact-repository.interface.js';
import { ContactRepository } from './infrastructure/persistence/repositories/contact.repository.js';
import { CreateContactUseCase } from './application/use-cases/create-contact.use-case.js';
import { UpdateContactUseCase } from './application/use-cases/update-contact.use-case.js';
import { DeleteContactUseCase } from './application/use-cases/delete-contact.use-case.js';
import { GetContactUseCase } from './application/use-cases/get-contact.use-case.js';
import { ListContactsUseCase } from './application/use-cases/list-contacts.use-case.js';
import { ContactsController } from './presentation/http/controllers/contacts.controller.js';

@Module({
  imports: [CompaniesModule],
  controllers: [ContactsController],
  providers: [
    ContactRepository,
    { provide: CONTACT_REPOSITORY, useExisting: ContactRepository },
    CreateContactUseCase,
    UpdateContactUseCase,
    DeleteContactUseCase,
    GetContactUseCase,
    ListContactsUseCase,
  ],
  exports: [CONTACT_REPOSITORY],
})
export class ContactsModule {}
