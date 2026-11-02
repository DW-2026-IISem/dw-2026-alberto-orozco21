import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { RoleList } from './role-list';

describe('RoleList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleList],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService, ConfirmationService],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates roles with uppercase names and initial status', () => {
    const fixture = TestBed.createComponent(RoleList);
    http.expectOne(`${environment.apiUrl}/roles`).flush({ roles: [] });
    const component = fixture.componentInstance;
    component.openCreate();
    component.form.patchValue({ name: 'operador', description: 'Operación diaria' });
    component.save();

    const request = http.expectOne(`${environment.apiUrl}/roles`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'OPERADOR',
      description: 'Operación diaria',
      status: 'active',
    });
    request.flush({ role: { id: 1 } });
    http.expectOne(`${environment.apiUrl}/roles`).flush({ roles: [] });
  });
});