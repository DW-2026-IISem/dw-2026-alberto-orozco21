import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Resource, ResourcePayload } from '../../../core/models/resource.model';
import { EntityApi } from '../../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class ResourceApi extends EntityApi<Resource, ResourcePayload> {
  constructor() {
    super(`${environment.apiUrl}/recursos`, 'resources', 'resource');
  }
}