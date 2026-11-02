import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { UserList } from './user-list';

describe('UserList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserList],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), MessageService, ConfirmationService,
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads users and does not send password or status when editing', () => {
    const fixture = TestBed.createComponent(UserList);
    http.expectOne(`${environment.apiUrl}/usuarios`).flush({ users: [] });
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.openEdit({
      id: 8,
      username: 'operator',
      email: 'operator@example.test',
      avatar: null,
      status: 'active',
    });
    component.form.patchValue({ username: 'operator-2', email: 'operator2@example.test' });
    component.save();

    const request = http.expectOne(`${environment.apiUrl}/usuarios/8`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({
      username: 'operator-2',
      email: 'operator2@example.test',
      avatar: null,
    });
    request.flush({ user: { id: 8 } });
    http.expectOne(`${environment.apiUrl}/usuarios`).flush({ users: [] });
  });
});