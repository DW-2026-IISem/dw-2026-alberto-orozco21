import { Inject, Injectable } from '@nestjs/common';
import { CompanyNitAlreadyExistsException } from '../../domain/exceptions/company-nit-already-exists.exception.js';
import { Company } from '../../domain/entities/company.entity.js';
import {
  COMPANY_REPOSITORY,
  type ICompanyRepository,
} from '../../domain/interfaces/company-repository.interface.js';
import { CreateCompanyDto } from '../dto/create-company.dto.js';
import { CompanyMapper } from '../mappers/company.mapper.js';

@Injectable()
export class CreateCompanyUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(dto: CreateCompanyDto) {
    const existing = await this.companyRepository.findByNit(dto.nit);
    if (existing) {
      throw new CompanyNitAlreadyExistsException(dto.nit);
    }

    const company = Company.create({
      nit: dto.nit,
      razonSocial: dto.razonSocial,
    });

    const created = await this.companyRepository.create(company);
    return CompanyMapper.toResponse(created);
  }
}
