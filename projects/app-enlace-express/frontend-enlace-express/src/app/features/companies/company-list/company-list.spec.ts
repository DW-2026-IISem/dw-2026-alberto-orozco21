import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { vi } from 'vitest';
import { environment } from '../../../../environments/environment';
import { CompanyList } from './company-list';

const API = environment.apiUrl;
const COLLECTION = 'companies';
const ENTITY = 'companies';
const RESOURCE = 'companies';
const ROWS = [
  {
    "id": 1,
    "nit": "900111222",
    "razon_social": "Tienda La Esquina",
    "contacto_principal_id": null,
    "direccion_facturacion_id": null,
    "is_active": true
  },
  {
    "id": 2,
    "nit": "900111222",
    "razon_social": "Sede Costa",
    "contacto_principal_id": null,
    "direccion_facturacion_id": null,
    "is_active": true
  }
];
const REFERENCES: Array<[string, string]> = [["contacts", "contacts"], ["address", "addresses"]];
const CREATE_PAYLOAD = {"nit": "900111222", "razon_social": "Nueva SAS", "is_active": true};
const UPDATE_PAYLOAD = {"razon_social": "Editada SAS"};

describe('CompanyList', () => {
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyList],
      providers: [provideHttpClient(), provideHttpClientTesting(), MessageService, ConfirmationService],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  function respondReferences(): void {
    for (const [path, collection] of REFERENCES) {
      http.expectOne(`${API}/${path}`).flush({ [collection]: [] });
    }
  }
  function respondLoad(rows = ROWS): void {
    http.expectOne(`${API}/${RESOURCE}`).flush({ [COLLECTION]: rows });
    respondReferences();
  }
  async function createList() {
    const fixture = TestBed.createComponent(CompanyList);
    respondLoad();
    await fixture.whenStable();
    return { fixture, list: fixture.componentInstance };
  }
  function acceptConfirmation(): void {
    const confirmation = TestBed.inject(ConfirmationService);
    vi.spyOn(confirmation, 'confirm').mockImplementation((data) => {
      data.accept?.();
      return confirmation;
    });
  }

  it('loads records on creation', async () => {
    const { list } = await createList();
    expect(list.rows()).toEqual(ROWS);
    expect(list.loading()).toBe(false);
    expect(list.error()).toBeNull();
  });
  it('shows the backend error when the primary list fails', async () => {
    const fixture = TestBed.createComponent(CompanyList);
    http.expectOne(`${API}/${RESOURCE}`).flush({ error: 'Backend failure' }, { status: 503, statusText: 'Unavailable' });
    respondReferences();
    await fixture.whenStable();
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect(fixture.componentInstance.error()).toContain('Backend failure');
  });
  it('filters locally without another API call', async () => {
    const { list } = await createList();
    list.filter.set('costa');
    expect(list.visibleRows()).toEqual([ROWS[1]]);
  });
  it('POSTs a new record and reloads', async () => {
    const { list } = await createList();
    list.openCreate();
    list.save(CREATE_PAYLOAD as never);
    const request = http.expectOne(`${API}/${RESOURCE}`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(CREATE_PAYLOAD);
    request.flush({ [ENTITY]: ROWS[0] });
    respondLoad();
  });
  it('PATCHes an edited record and reloads', async () => {
    const { list } = await createList();
    list.openEdit(ROWS[0] as never);
    list.save(UPDATE_PAYLOAD as never);
    const request = http.expectOne(`${API}/${RESOURCE}/1`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual(UPDATE_PAYLOAD);
    request.flush({ [ENTITY]: ROWS[0] });
    respondLoad();
  });
  it('deactivates after confirmation and reloads', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.deactivate(ROWS[0] as never);
    const request = http.expectOne(`${API}/${RESOURCE}/1/deactivate`);
    expect(request.request.method).toBe('PATCH');
    request.flush({ message: 'Deactivated' });
    respondLoad(ROWS.slice(1));
  });
  it('deletes after confirmation and reloads', async () => {
    const { list } = await createList();
    acceptConfirmation();
    list.remove(ROWS[0] as never);
    const request = http.expectOne(`${API}/${RESOURCE}/1`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    respondLoad(ROWS.slice(1));
  });
});
