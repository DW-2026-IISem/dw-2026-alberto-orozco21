import { Component, OnInit, computed, inject, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { forkJoin, of } from 'rxjs';
import { Company } from '../../core/models/company.model';
import { Invoice } from '../../core/models/invoice.model';
import { Shipment } from '../../core/models/shipment.model';
import { CompanyApi } from '../companies/company-api';
import { InvoiceApi } from '../invoices/invoice-api';
import { ShipmentApi } from '../shipments/shipment-api';
import { SessionStore } from '../../core/services/session-store';
import { toNumber } from '../../core/models/api.model';
import { toApiMessage } from '../../core/utils/api-error';

type DashboardSection = 'Empresas' | 'Envíos' | 'Facturas';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule, SkeletonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly companiesApi = inject(CompanyApi);
  private readonly shipmentsApi = inject(ShipmentApi);
  private readonly invoicesApi = inject(InvoiceApi);
  readonly session = inject(SessionStore);

  readonly sectionRequested = output<DashboardSection>();
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly companies = signal<Company[]>([]);
  readonly shipments = signal<Shipment[]>([]);
  readonly invoices = signal<Invoice[]>([]);

  readonly canViewCompanies = computed(() => this.session.canPermission('GET /api/companies'));
  readonly canViewShipments = computed(() => this.session.canPermission('GET /api/shipments'));
  readonly canViewInvoices = computed(() => this.session.canPermission('GET /api/invoices'));
  readonly activeCompanyCount = computed(
    () => this.companies().filter((company) => company.is_active).length,
  );
  readonly activeShipmentCount = computed(
    () => this.shipments().filter((shipment) => shipment.is_active && shipment.estado !== 'cancelado').length,
  );
  readonly inTransitCount = computed(
    () => this.shipments().filter((shipment) => shipment.is_active && shipment.estado === 'en_ruta').length,
  );
  readonly incidentCount = computed(
    () => this.shipments().filter((shipment) => shipment.is_active && shipment.estado === 'con_novedad').length,
  );
  readonly pendingInvoices = computed(
    () => this.invoices().filter(
      (invoice) => invoice.is_active && (invoice.estado === 'pendiente' || invoice.estado === 'vencida'),
    ),
  );
  readonly pendingInvoiceTotal = computed(
    () => this.pendingInvoices().reduce((total, invoice) => total + toNumber(invoice.total), 0),
  );
  readonly latestShipments = computed(() =>
    [...this.shipments()]
      .filter((shipment) => shipment.is_active)
      .sort((left, right) =>
        new Date(right.fecha_solicitud).getTime() - new Date(left.fecha_solicitud).getTime(),
      )
      .slice(0, 5),
  );
  readonly companyNames = computed(
    () => new Map(this.companies().map((company) => [company.id, company.razon_social])),
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      companies: this.canViewCompanies() ? this.companiesApi.list() : of([] as Company[]),
      shipments: this.canViewShipments() ? this.shipmentsApi.list() : of([] as Shipment[]),
      invoices: this.canViewInvoices() ? this.invoicesApi.list() : of([] as Invoice[]),
    }).subscribe({
      next: ({ companies, shipments, invoices }) => {
        this.companies.set(companies);
        this.shipments.set(shipments);
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  requestSection(section: DashboardSection): void {
    this.sectionRequested.emit(section);
  }

  companyName(id: number): string {
    return this.companyNames().get(id) ?? `Empresa #${id}`;
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  }

  shipmentCost(value: Shipment['costo_calculado']): string {
    return this.formatMoney(toNumber(value));
  }

  formatDate(value: string): string {
    const date = new Date(value.includes('T') ? value : `${value}T12:00:00`);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  statusLabel(status: Shipment['estado']): string {
    const labels: Record<Shipment['estado'], string> = {
      creado: 'Creado',
      cotizado: 'Cotizado',
      asignado: 'Asignado',
      en_ruta: 'En ruta',
      entregado: 'Entregado',
      con_novedad: 'Con novedad',
      cancelado: 'Cancelado',
    };
    return labels[status];
  }

  statusClass(status: Shipment['estado']): string {
    if (status === 'entregado') return 'shipment-status shipment-status--delivered';
    if (status === 'con_novedad' || status === 'cancelado') return 'shipment-status shipment-status--alert';
    if (status === 'en_ruta') return 'shipment-status shipment-status--moving';
    return 'shipment-status shipment-status--pending';
  }
}