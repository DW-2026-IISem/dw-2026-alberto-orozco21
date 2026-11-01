import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { vi } from 'vitest';
import { environment } from '../../../../environments/environment';
import { InvoiceList } from './invoice-list';

const API = environment.apiUrl;
const COLLECTION = 'invoices';
const ENTITY = 'invoice';
const RESOURCE = 'invoices';
const ROWS = [
  {
    "id": 1,
    "numero": "INV-2026-001",
    "empresa_id": 1,
    "periodo_desde": "2026-01-01",
    "periodo_hasta": "2026-01-31",
    "fecha": "2026-02-01",
    "subtotal": 10000,
    "impuestos": 1900,
    "total": 11900,
    "estado": "pendiente",
    "fecha_pago": null,
    "is_active": true
  },
  {
    "id": 2,
    "numero": "COSTA-002",
    "empresa_id": 1,
    "periodo_desde": "2026-01-01",
    "periodo_hasta": "2026-01-31",
    "fecha": "2026-02-01",
    "subtotal": 10000,
    "impuestos": 1900,
    "total": 11900,
    "estado": "pendiente",
    "fecha_pago": null,
    "is_active": true
  }
];
const REFERENCES: Array<[string, string]> = [["companies", "companies"]];
const CREATE_PAYLOAD = {"numero": "INV-2026-001", "empresa_id": 1, "periodo_desde": "2026-01-01", "periodo_hasta": "2026-01-31", "fecha": "2026-02-01", "subtotal": 10000, "total": 11900, "is_active": true};
const UPDATE_PAYLOAD = {"numero": "INV-2026-002"};

describe('InvoiceList', () => {
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceList],
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
    const fixture = TestBed.createComponent(InvoiceList);
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
    const fixture = TestBed.createComponent(InvoiceList);
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
