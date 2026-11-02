import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { SessionStore } from '../../../../core/services/session-store';
import { ResourceRoleList } from './resource-role-list';

describe('ResourceRoleList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceRoleList],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), MessageService, ConfirmationService,
        { provide: SessionStore, useValue: { canPermission: () => true } },
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates a grant using the selected role and resource', () => {
    const fixture = TestBed.createComponent(ResourceRoleList);
    http.expectOne(`${environment.apiUrl}/concesiones-rol`).flush({ grants: [] });
    http.expectOne(`${environment.apiUrl}/roles`).flush({ roles: [] });
    http.expectOne(`${environment.apiUrl}/recursos`).flush({ resources: [] });
    const component = fixture.componentInstance;
    component.openCreate();
    component.form.setValue({ role_id: 4, resource_id: 12 });
    component.save();

    const request = http.expectOne(`${environment.apiUrl}/concesiones-rol`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ role_id: 4, resource_id: 12 });
    request.flush({ grant: { id: 8, role_id: 4, resource_id: 12, status: 'active' } });
    http.expectOne(`${environment.apiUrl}/concesiones-rol`).flush({ grants: [] });
    http.expectOne(`${environment.apiUrl}/roles`).flush({ roles: [] });
    http.expectOne(`${environment.apiUrl}/recursos`).flush({ resources: [] });
  });
});