import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EffectivePermission } from '../../../core/models/auth.model';
import {
  ChangePasswordPayload,
  CreateUserPayload,
  PatchUserPayload,
  UpdateUserPayload,
  User,
} from '../../../core/models/user.model';
import { EntityApi } from '../../../core/services/entity-api';

@Injectable({ providedIn: 'root' })
export class UserApi extends EntityApi<User, CreateUserPayload, PatchUserPayload, UpdateUserPayload> {
  constructor() {
    super(`${environment.apiUrl}/usuarios`, 'users', 'user');
  }

  changePassword(id: number, payload: ChangePasswordPayload): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/password`, payload);
  }

  permissions(id: number): Observable<EffectivePermission[]> {
    return this.http
      .get<{ permissions: EffectivePermission[] }>(`${this.base}/${id}/permisos`)
      .pipe(map((response) => response.permissions));
  }
}