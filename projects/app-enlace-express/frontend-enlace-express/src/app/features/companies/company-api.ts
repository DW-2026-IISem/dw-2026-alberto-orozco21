import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Company, CompanyPayload } from '../../core/models/company.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class CompanyApi extends EntityApi<Company, CompanyPayload> {
  constructor() {
    super(`${environment.apiUrl}/companies`, 'companies', 'companies');
  }
}