import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { SessionStore } from '../../../../core/services/session-store';
import { RoleUserList } from './role-user-list';

describe('RoleUserList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleUserList],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), MessageService, ConfirmationService,
        { provide: SessionStore, useValue: { canPermission: () => true } },
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates a user-role assignment with the selected identifiers', () => {
    const fixture = TestBed.createComponent(RoleUserList);
    http.expectOne(`${environment.apiUrl}/asignaciones-rol`).flush({ assignments: [] });
    http.expectOne(`${environment.apiUrl}/usuarios`).flush({ users: [] });
    http.expectOne(`${environment.apiUrl}/roles`).flush({ roles: [] });
    const component = fixture.componentInstance;
    component.openCreate();
    component.form.setValue({ user_id: 8, role_id: 3 });
    component.save();

    const request = http.expectOne(`${environment.apiUrl}/asignaciones-rol`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ user_id: 8, role_id: 3 });
    request.flush({ assignment: { id: 5, user_id: 8, role_id: 3, status: 'active' } });
    http.expectOne(`${environment.apiUrl}/asignaciones-rol`).flush({ assignments: [] });
    http.expectOne(`${environment.apiUrl}/usuarios`).flush({ users: [] });
    http.expectOne(`${environment.apiUrl}/roles`).flush({ roles: [] });
  });
});