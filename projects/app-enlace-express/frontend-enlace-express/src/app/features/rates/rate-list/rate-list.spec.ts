import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { vi } from 'vitest';
import { environment } from '../../../../environments/environment';
import { RateList } from './rate-list';

const API = environment.apiUrl;
const COLLECTION = 'rates';
const ENTITY = 'rate';
const RESOURCE = 'rates';
const ROWS = [
  {
    "id": 1,
    "nombre": "Tarifa Norte",
    "zona": "Norte",
    "regla_calculo": "por_peso",
    "valor_base": 10000,
    "valor_por_kg_adicional": 1000,
    "recargo_urgente_pct": 10,
    "vigencia_desde": "2026-01-01",
    "vigencia_hasta": null,
    "is_active": true
  },
  {
    "id": 2,
    "nombre": "Sede Costa",
    "zona": "Norte",
    "regla_calculo": "por_peso",
    "valor_base": 10000,
    "valor_por_kg_adicional": 1000,
    "recargo_urgente_pct": 10,
    "vigencia_desde": "2026-01-01",
    "vigencia_hasta": null,
    "is_active": true
  }
];
const REFERENCES: Array<[string, string]> = [];
const CREATE_PAYLOAD = {"nombre": "Tarifa Costa", "zona": "Costa", "valor_base": 10000, "vigencia_desde": "2026-01-01", "is_active": true};
const UPDATE_PAYLOAD = {"nombre": "Tarifa Editada"};

describe('RateList', () => {
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateList],
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
    const fixture = TestBed.createComponent(RateList);
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
    const fixture = TestBed.createComponent(RateList);
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
