import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Company } from '../../core/models/company.model';
import { Invoice } from '../../core/models/invoice.model';
import { Shipment } from '../../core/models/shipment.model';
import { User } from '../../core/models/user.model';
import { SessionStore } from '../../core/services/session-store';
import { CompanyApi } from '../companies/company-api';
import { InvoiceApi } from '../invoices/invoice-api';
import { ShipmentApi } from '../shipments/shipment-api';
import { Dashboard } from './dashboard';

const companies: Company[] = [
  { id: 1, nit: '9001', razon_social: 'Carga Norte', contacto_principal_id: null, direccion_facturacion_id: null, is_active: true },
  { id: 2, nit: '9002', razon_social: 'Carga Sur', contacto_principal_id: null, direccion_facturacion_id: null, is_active: false },
];

const shipments: Shipment[] = [
  makeShipment(1, { estado: 'en_ruta', fecha_solicitud: '2026-10-30', costo_calculado: '12500.50' }),
  makeShipment(2, { estado: 'con_novedad', fecha_solicitud: '2026-10-31', costo_calculado: 7500 }),
  makeShipment(3, { estado: 'cancelado', fecha_solicitud: '2026-11-01' }),
];

const invoices: Invoice[] = [
  { id: 1, numero: 'F-001', empresa_id: 1, periodo_desde: '2026-10-01', periodo_hasta: '2026-10-31', fecha: '2026-11-01', subtotal: '12500.50', impuestos: 0, total: '12500.50', estado: 'pendiente', fecha_pago: null, is_active: true },
  { id: 2, numero: 'F-002', empresa_id: 1, periodo_desde: '2026-09-01', periodo_hasta: '2026-09-30', fecha: '2026-10-01', subtotal: '7500', impuestos: 0, total: '7500', estado: 'vencida', fecha_pago: null, is_active: true },
  { id: 3, numero: 'F-003', empresa_id: 1, periodo_desde: '2026-08-01', periodo_hasta: '2026-08-31', fecha: '2026-09-01', subtotal: 1000, impuestos: 0, total: 1000, estado: 'pagada', fecha_pago: '2026-09-02', is_active: true },
];

function makeShipment(id: number, overrides: Partial<Shipment>): Shipment {
  return {
    id,
    numero_guia: `EE-${id}`,
    empresa_id: 1,
    contacto_origen_id: 1,
    direccion_origen_id: 1,
    contacto_destino_id: 2,
    direccion_destino_id: 2,
    mensajero_id: null,
    ruta_id: null,
    tarifa_id: 1,
    factura_id: null,
    prioridad: 'normal',
    peso_total_kg: 1,
    valor_declarado: null,
    costo_calculado: null,
    estado: 'creado',
    fecha_solicitud: '2026-10-01',
    fecha_entrega_estimada: null,
    fecha_entrega_real: null,
    is_active: true,
    ...overrides,
  };
}

async function createDashboard(canRead: (permission: string) => boolean) {
  const requested: string[] = [];
  await TestBed.configureTestingModule({
    imports: [Dashboard],
    providers: [
      {
        provide: CompanyApi,
        useValue: { list: () => { requested.push('companies'); return of(companies); } },
      },
      {
        provide: ShipmentApi,
        useValue: { list: () => { requested.push('shipments'); return of(shipments); } },
      },
      {
        provide: InvoiceApi,
        useValue: { list: () => { requested.push('invoices'); return of(invoices); } },
      },
      {
        provide: SessionStore,
        useValue: { canPermission: canRead, user: signal<User | null>(null) },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(Dashboard);
  fixture.detectChanges();
  await fixture.whenStable();
  return { component: fixture.componentInstance, requested };
}

describe('Dashboard', () => {
  it('derives operational KPIs, normalizes decimal strings, and sorts recent shipments', async () => {
    const { component, requested } = await createDashboard(() => true);

    expect(requested).toEqual(['companies', 'shipments', 'invoices']);
    expect(component.activeCompanyCount()).toBe(1);
    expect(component.activeShipmentCount()).toBe(2);
    expect(component.inTransitCount()).toBe(1);
    expect(component.incidentCount()).toBe(1);
    expect(component.pendingInvoices()).toHaveLength(2);
    expect(component.pendingInvoiceTotal()).toBe(20000.5);
    expect(component.latestShipments().map((shipment) => shipment.id)).toEqual([3, 2, 1]);
    expect(component.companyName(1)).toBe('Carga Norte');
  });

  it('requests only collections covered by effective read permissions', async () => {
    const { component, requested } = await createDashboard((permission) => permission === 'GET /api/shipments');

    expect(requested).toEqual(['shipments']);
    expect(component.canViewCompanies()).toBe(false);
    expect(component.canViewShipments()).toBe(true);
    expect(component.canViewInvoices()).toBe(false);
    expect(component.loading()).toBe(false);
  });
});
