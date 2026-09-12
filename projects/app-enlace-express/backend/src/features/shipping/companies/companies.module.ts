import { Module } from '@nestjs/common';
import { COMPANY_REPOSITORY } from './domain/interfaces/company-repository.interface.js';
import { CompanyRepository } from './infrastructure/persistence/repositories/company.repository.js';
import { CreateCompanyUseCase } from './application/use-cases/create-company.use-case.js';
import { UpdateCompanyUseCase } from './application/use-cases/update-company.use-case.js';
import { DeleteCompanyUseCase } from './application/use-cases/delete-company.use-case.js';
import { GetCompanyUseCase } from './application/use-cases/get-company.use-case.js';
import { ListCompaniesUseCase } from './application/use-cases/list-companies.use-case.js';
import { CompaniesController } from './presentation/http/controllers/companies.controller.js';

@Module({
  controllers: [CompaniesController],
  providers: [
    CompanyRepository,
    { provide: COMPANY_REPOSITORY, useExisting: CompanyRepository },
    CreateCompanyUseCase,
    UpdateCompanyUseCase,
    DeleteCompanyUseCase,
    GetCompanyUseCase,
    ListCompaniesUseCase,
  ],
  exports: [COMPANY_REPOSITORY],
})
export class CompaniesModule {}
