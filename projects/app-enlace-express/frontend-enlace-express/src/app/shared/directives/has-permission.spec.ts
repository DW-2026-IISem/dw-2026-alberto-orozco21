import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectivePermission } from '../../core/models/auth.model';
import { SessionStore } from '../../core/services/session-store';
import { HasPermission } from './has-permission';

const companyReadPermission: EffectivePermission = {
  resource_id: 1,
  method: 'GET',
  path: '/api/companies',
  description: 'Listar empresas',
  role_id: 1,
  role_name: 'OPERADOR',
};

@Component({
  standalone: true,
  imports: [HasPermission],
  template: `<span *appHasPermission="'GET /api/companies'">Empresas</span>`,
})
class PermissionHost {}

describe('HasPermission', () => {
  beforeEach(() => {
    localStorage.removeItem('enlace-express.session.v1');
    TestBed.configureTestingModule({ imports: [PermissionHost] });
  });

  it('renders only while the matching permission is granted', () => {
    const session = TestBed.inject(SessionStore);
    const fixture = TestBed.createComponent(PermissionHost);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Empresas');

    session.setAccess({
      user: {
        id: 1,
        username: 'operator',
        email: 'operator@example.test',
        avatar: null,
        status: 'active',
      },
      permissions: [companyReadPermission],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Empresas');

    session.setAccess({
      user: {
        id: 1,
        username: 'operator',
        email: 'operator@example.test',
        avatar: null,
        status: 'active',
      },
      permissions: [],
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Empresas');
  });
});