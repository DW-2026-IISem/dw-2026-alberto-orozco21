import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { ResourceList } from './resource-list';

describe('ResourceList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceList],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService, ConfirmationService],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requires an absolute path and creates the normalized resource payload', () => {
    const fixture = TestBed.createComponent(ResourceList);
    http.expectOne(`${environment.apiUrl}/recursos`).flush({ resources: [] });
    const component = fixture.componentInstance;
    component.openCreate();
    component.form.patchValue({ path: 'api/shipments', method: 'get' as never });
    component.save();
    http.expectNone(`${environment.apiUrl}/recursos`, 'invalid form must not submit');

    component.form.patchValue({ path: '/api/shipments', method: 'GET' });
    component.save();
    const request = http.expectOne(`${environment.apiUrl}/recursos`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      path: '/api/shipments',
      method: 'GET',
      description: null,
      status: 'active',
    });
    request.flush({ resource: { id: 1 } });
    http.expectOne(`${environment.apiUrl}/recursos`).flush({ resources: [] });
  });
});