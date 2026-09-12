import { Inject, Injectable } from '@nestjs/common';
import {
  COMPANY_REPOSITORY,
  type ICompanyRepository,
} from '../../domain/interfaces/company-repository.interface.js';
import { CompanyFilterDto } from '../dto/company-filter.dto.js';
import { CompanyMapper } from '../mappers/company.mapper.js';

@Injectable()
export class ListCompaniesUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(filter: CompanyFilterDto) {
    const result = await this.companyRepository.findAll(filter);
    return {
      items: result.items.map((company) => CompanyMapper.toResponse(company)),
      meta: result.meta,
    };
  }
}
