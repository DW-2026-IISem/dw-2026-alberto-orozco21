import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Package, PackagePayload } from '../../core/models/package.model';
import { EntityApi } from '../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class PackageApi extends EntityApi<Package, PackagePayload> {
  constructor() {
    super(`${environment.apiUrl}/packages`, 'packages', 'package');
  }
}