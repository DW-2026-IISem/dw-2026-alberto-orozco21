import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddressApi } from '../../features/addresses/address-api';
import { CompanyApi } from '../../features/companies/company-api';
import { ContactApi } from '../../features/contacts/contact-api';
import { DeliveryProofApi } from '../../features/delivery-proofs/delivery-proof-api';
import { InvoiceApi } from '../../features/invoices/invoice-api';
import { MessengerApi } from '../../features/messengers/messenger-api';
import { PackageApi } from '../../features/packages/package-api';
import { RateApi } from '../../features/rates/rate-api';
import { ResourceApi } from '../../features/admin/resources/resource-api';
import { RoleApi } from '../../features/admin/roles/role-api';
import { RouteApi } from '../../features/routes/route-api';
import { ShipmentApi } from '../../features/shipments/shipment-api';
import { TrackingEventApi } from '../../features/tracking-events/tracking-event-api';
import { UserApi } from '../../features/admin/users/user-api';
import { RoleUserApi } from '../../features/admin/role-users/role-user-api';
import { ResourceRoleApi } from '../../features/admin/resource-roles/resource-role-api';
import { SessionApi } from '../../features/auth/session-api';

const BASE = environment.apiUrl;

interface ListApi {
  list(): Observable<unknown[]>;
}

interface GetApi {
  get(id: number): Observable<unknown>;
}

describe('Entity APIs', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should build all collection URLs and unwrap their actual response keys', () => {
    const cases: Array<{ api: ListApi; path: string; key: string }> = [
      { api: TestBed.inject(CompanyApi), path: '/companies', key: 'companies' },
      { api: TestBed.inject(ContactApi), path: '/contacts', key: 'contacts' },
      { api: TestBed.inject(AddressApi), path: '/address', key: 'addresses' },
      { api: TestBed.inject(MessengerApi), path: '/messengers', key: 'messengers' },
      { api: TestBed.inject(RateApi), path: '/rates', key: 'rates' },
      { api: TestBed.inject(RouteApi), path: '/routes', key: 'routes' },
      { api: TestBed.inject(ShipmentApi), path: '/shipments', key: 'shipments' },
      { api: TestBed.inject(PackageApi), path: '/packages', key: 'packages' },
      {
        api: TestBed.inject(TrackingEventApi),
        path: '/tracking_events',
        key: 'tracking_events',
      },
      {
        api: TestBed.inject(DeliveryProofApi),
        path: '/delivery_proofs',
        key: 'delivery_proofs',
      },
      { api: TestBed.inject(InvoiceApi), path: '/invoices', key: 'invoices' },
      { api: TestBed.inject(UserApi), path: '/usuarios', key: 'users' },
      { api: TestBed.inject(RoleApi), path: '/roles', key: 'roles' },
      { api: TestBed.inject(ResourceApi), path: '/recursos', key: 'resources' },
    ];

    for (const { api, path, key } of cases) {
      let actual: unknown[] | undefined;
      api.list().subscribe((value) => (actual = value));
      const request = http.expectOne(`${BASE}${path}`);
      expect(request.request.method).toBe('GET');
      request.flush({ [key]: [{ id: 1 }] });
      expect(actual).toEqual([{ id: 1 }]);
    }
  });

  it('should unwrap detail responses using the controller-specific key', () => {
    const cases: Array<{ api: GetApi; path: string; key: string }> = [
      { api: TestBed.inject(CompanyApi), path: '/companies', key: 'companies' },
      { api: TestBed.inject(ContactApi), path: '/contacts', key: 'contact' },
      { api: TestBed.inject(AddressApi), path: '/address', key: 'address' },
      { api: TestBed.inject(ShipmentApi), path: '/shipments', key: 'shipment' },
      {
        api: TestBed.inject(TrackingEventApi),
        path: '/tracking_events',
        key: 'trackingEvent',
      },
      {
        api: TestBed.inject(DeliveryProofApi),
        path: '/delivery_proofs',
        key: 'deliveryProof',
      },
    ];

    for (const { api, path, key } of cases) {
      let actual: unknown;
      api.get(7).subscribe((value) => (actual = value));
      const request = http.expectOne(`${BASE}${path}/7`);
      request.flush({ [key]: { id: 7 } });
      expect(actual).toEqual({ id: 7 });
    }
  });

  it('should use the Company wrapper for create, patch, put, deactivate and delete', () => {
    const api = TestBed.inject(CompanyApi);
    const payload = { nit: '900123456', razon_social: 'Enlace prueba' };

    api.create(payload).subscribe();
    const create = http.expectOne(`${BASE}/companies`);
    expect(create.request.method).toBe('POST');
    create.flush({ companies: { id: 1, ...payload } });

    api.update(1, { razon_social: 'Actualizada' }).subscribe();
    const update = http.expectOne(`${BASE}/companies/1`);
    expect(update.request.method).toBe('PATCH');
    update.flush({ companies: { id: 1, ...payload, razon_social: 'Actualizada' } });

    api.replace(1, payload).subscribe();
    const replace = http.expectOne(`${BASE}/companies/1`);
    expect(replace.request.method).toBe('PUT');
    replace.flush({ companies: { id: 1, ...payload } });

    api.deactivate(1).subscribe();
    const deactivate = http.expectOne(`${BASE}/companies/1/deactivate`);
    expect(deactivate.request.method).toBe('PATCH');
    deactivate.flush({ message: 'deactivated' });

    api.remove(1).subscribe();
    const remove = http.expectOne(`${BASE}/companies/1`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush({ message: 'deleted' });
  });

  it('should send User password changes to the dedicated endpoint', () => {
    const api = TestBed.inject(UserApi);
    const payload = { current_password: 'old', new_password: 'new' };
    api.changePassword(3, payload).subscribe();
    const request = http.expectOne(`${BASE}/usuarios/3/password`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(payload);
    request.flush({ message: 'Password updated', id: 3 });
  });

  it('should unwrap permissions from the User endpoint', () => {
    const api = TestBed.inject(UserApi);
    let actual: unknown;
    api.permissions(3).subscribe((permissions) => (actual = permissions));
    const request = http.expectOne(`${BASE}/usuarios/3/permisos`);
    request.flush({ permissions: [{ resource_id: 1, method: 'GET', path: '/api/companies' }] });
    expect(actual).toHaveLength(1);
  });

  it('should unwrap assignments and support role assignment reactivation', () => {
    const api = TestBed.inject(RoleUserApi);
    let actual: unknown[] | undefined;
    api.list().subscribe((assignments) => (actual = assignments));
    http.expectOne(`${BASE}/asignaciones-rol`).flush({ assignments: [{ id: 1 }] });
    expect(actual).toEqual([{ id: 1 }]);

    api.reactivate(1).subscribe();
    const request = http.expectOne(`${BASE}/asignaciones-rol/1/reactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ assignment: { id: 1, status: 'active' } });
  });

  it('should build ResourceRole query parameters and unwrap grants', () => {
    const api = TestBed.inject(ResourceRoleApi);
    let actual: unknown[] | undefined;
    api.list({ role_id: 2, resource_id: 8 }).subscribe((grants) => (actual = grants));
    const request = http.expectOne(
      (candidate) =>
        candidate.url === `${BASE}/concesiones-rol` &&
        candidate.params.get('role_id') === '2' &&
        candidate.params.get('resource_id') === '8',
    );
    request.flush({ grants: [{ id: 10 }] });
    expect(actual).toEqual([{ id: 10 }]);
  });

  it('should unwrap ResourceRole details and return the grant on creation', () => {
    const api = TestBed.inject(ResourceRoleApi);
    let detail: unknown;
    api.get(10).subscribe((value) => (detail = value));
    http.expectOne(`${BASE}/concesiones-rol/10`).flush({ grant: { id: 10 } });
    expect(detail).toEqual({ id: 10 });

    let created: unknown;
    api.create({ role_id: 2, resource_id: 8 }).subscribe((value) => (created = value));
    const request = http.expectOne(`${BASE}/concesiones-rol`);
    expect(request.request.body).toEqual({ role_id: 2, resource_id: 8 });
    request.flush({ message: 'granted', grant: { id: 11 } });
    expect(created).toEqual({ id: 11 });
  });

  it('should send login, refresh and logout to public session endpoints', () => {
    const api = TestBed.inject(SessionApi);
    api.login({ identifier: 'operator', password: 'secret' }).subscribe();
    const login = http.expectOne(`${BASE}/sesion/login`);
    expect(login.request.method).toBe('POST');
    login.flush({ access_token: 'a', refresh_token: 'r' });

    api.refresh({ refresh_token: 'r' }).subscribe();
    const refresh = http.expectOne(`${BASE}/sesion/refresh`);
    expect(refresh.request.method).toBe('POST');
    refresh.flush({ access_token: 'b', refresh_token: 's' });

    api.logout({ refresh_token: 's' }).subscribe();
    const logout = http.expectOne(`${BASE}/sesion/logout`);
    expect(logout.request.body).toEqual({ refresh_token: 's' });
    logout.flush({ message: 'Session closed' });
  });

  it('should unwrap profile and effective permissions', () => {
    const api = TestBed.inject(SessionApi);
    let profile: unknown;
    api.profile().subscribe((user) => (profile = user));
    http.expectOne(`${BASE}/sesion/perfil`).flush({ user: { id: 5, username: 'operator' } });
    expect(profile).toEqual({ id: 5, username: 'operator' });

    let permissions: unknown[] | undefined;
    api.permissions().subscribe((value) => (permissions = value));
    http.expectOne(`${BASE}/permisos`).flush({ permissions: [{ resource_id: 2 }] });
    expect(permissions).toEqual([{ resource_id: 2 }]);
  });

  it('should unwrap sessions and revoke or purge them with the documented verbs', () => {
    const api = TestBed.inject(SessionApi);
    let sessions: unknown[] | undefined;
    api.listSessions().subscribe((value) => (sessions = value));
    http.expectOne(`${BASE}/sesiones`).flush({ sessions: [{ id: 1, is_expired: false }] });
    expect(sessions).toEqual([{ id: 1, is_expired: false }]);

    let session: unknown;
    api.getSession(1).subscribe((value) => (session = value));
    http.expectOne(`${BASE}/sesiones/1`).flush({ session: { id: 1 } });
    expect(session).toEqual({ id: 1 });

    api.deactivateAllSessions().subscribe();
    const revokeAll = http.expectOne(`${BASE}/sesiones/deactivate-all`);
    expect(revokeAll.request.method).toBe('PATCH');
    revokeAll.flush({ message: 'revoked', revoked: 1 });

    api.deactivateSession(1).subscribe();
    const revokeOne = http.expectOne(`${BASE}/sesiones/1/deactivate`);
    expect(revokeOne.request.method).toBe('PATCH');
    revokeOne.flush({ message: 'revoked', session: { id: 1 } });

    api.purgeInactiveSessions().subscribe();
    const purge = http.expectOne(`${BASE}/sesiones`);
    expect(purge.request.method).toBe('DELETE');
    purge.flush({ message: 'purged', purged: 1 });
  });

  it('should use the configured API base without adding session interceptors', () => {
    expect(environment.apiUrl.endsWith('/api')).toBe(true);
    const api = TestBed.inject(CompanyApi);
    api.list().subscribe();
    const request = http.expectOne('http://localhost:4000/api/companies');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ companies: [] });
  });
});