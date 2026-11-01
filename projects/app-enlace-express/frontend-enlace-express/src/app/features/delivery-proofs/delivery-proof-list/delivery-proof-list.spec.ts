import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { vi } from 'vitest';
import { environment } from '../../../../environments/environment';
import { DeliveryProofList } from './delivery-proof-list';

const API = environment.apiUrl;
const COLLECTION = 'delivery_proofs';
const ENTITY = 'delivery_proof';
const RESOURCE = 'delivery_proofs';
const ROWS = [
  {
    "id": 1,
    "envio_id": 1,
    "fecha_hora": "2026-01-01T10:30:00.000Z",
    "receptor_nombre": "Ana Pérez",
    "receptor_documento": "123456",
    "firma_url": null,
    "foto_url": null,
    "geolocalizacion_lat": null,
    "geolocalizacion_lng": null,
    "observaciones": null,
    "estado": "valida",
    "is_active": true
  },
  {
    "id": 2,
    "envio_id": 1,
    "fecha_hora": "2026-01-01T10:30:00.000Z",
    "receptor_nombre": "Receptor Costa",
    "receptor_documento": "123456",
    "firma_url": null,
    "foto_url": null,
    "geolocalizacion_lat": null,
    "geolocalizacion_lng": null,
    "observaciones": null,
    "estado": "valida",
    "is_active": true
  }
];
const REFERENCES: Array<[string, string]> = [["shipments", "shipments"]];
const CREATE_PAYLOAD = {"envio_id": 1, "fecha_hora": "2026-01-01T10:30:00.000Z", "receptor_nombre": "Ana Pérez", "is_active": true};
const UPDATE_PAYLOAD = {"receptor_nombre": "Ana Actualizada"};

describe('DeliveryProofList', () => {
  let http: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryProofList],
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
    const fixture = TestBed.createComponent(DeliveryProofList);
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
    const fixture = TestBed.createComponent(DeliveryProofList);
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
