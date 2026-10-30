import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Role, RolePayload } from '../../../core/models/role.model';
import { EntityApi } from '../../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class RoleApi extends EntityApi<Role, RolePayload> {
  constructor() {
    super(`${environment.apiUrl}/roles`, 'roles', 'role');
  }
}