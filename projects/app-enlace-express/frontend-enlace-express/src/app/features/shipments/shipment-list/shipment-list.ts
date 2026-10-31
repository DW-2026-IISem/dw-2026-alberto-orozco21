import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Shipment, ShipmentPayload } from '../../../core/models/shipment.model';
import { Company } from '../../../core/models/company.model';
import { Contact } from '../../../core/models/contact.model';
import { Address } from '../../../core/models/address.model';
import { Messenger } from '../../../core/models/messenger.model';
import { Route } from '../../../core/models/route.model';
import { Rate } from '../../../core/models/rate.model';
import { Invoice } from '../../../core/models/invoice.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { humanize } from '../../../core/utils/labels';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { CompanyApi } from '../../companies/company-api';
import { ContactApi } from '../../contacts/contact-api';
import { AddressApi } from '../../addresses/address-api';
import { MessengerApi } from '../../messengers/messenger-api';
import { RouteApi } from '../../routes/route-api';
import { RateApi } from '../../rates/rate-api';
import { InvoiceApi } from '../../invoices/invoice-api';
import { ShipmentApi } from '../shipment-api';
import { ShipmentForm } from '../shipment-form/shipment-form';

/**
 * Lista de envíos con todas las operaciones del CRUD.
 *
 * Todo el estado vive en signals: la tabla y los contadores se repintan solos y
 * `visibleRows` se recalcula solo cuando cambian `rows()` o `filter()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-shipment-list',
  imports: [ButtonModule, CurrencyPipe, DatePipe, DialogModule, EmptyState, InputTextModule, MessageModule, PageHeader, ShipmentForm, StatusTag, TableModule, TagModule, TooltipModule],
  templateUrl: './shipment-list.html',
  styleUrl: './shipment-list.css',
})
export class ShipmentList {
  private readonly api = inject(ShipmentApi);
  private readonly companyApi = inject(CompanyApi);
  private readonly contactApi = inject(ContactApi);
  private readonly addressApi = inject(AddressApi);
  private readonly messengerApi = inject(MessengerApi);
  private readonly routeApi = inject(RouteApi);
  private readonly rateApi = inject(RateApi);
  private readonly invoiceApi = inject(InvoiceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/shipments`). */
  readonly rows = signal<Shipment[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly contacts = signal<Contact[]>([]);
  readonly addresses = signal<Address[]>([]);
  readonly messengers = signal<Messenger[]>([]);
  readonly routes = signal<Route[]>([]);
  readonly rates = signal<Rate[]>([]);
  readonly invoices = signal<Invoice[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador; `computed` lo memoriza. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.numero_guia,
      row.prioridad,
      row.estado,
      this.companyName()(row.empresa_id),
      this.messengerName()(row.mensajero_id),
    ]),
  );

  /** `id → razon_social` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly companyName = computed(() => {
    const names = new Map<number, string>(this.companies().map((item) => [item.id, String(item.razon_social)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  /** `id → nombre` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly contactName = computed(() => {
    const names = new Map<number, string>(this.contacts().map((item) => [item.id, String(item.nombre)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  /** `id → alias` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly addressName = computed(() => {
    const names = new Map<number, string>(this.addresses().map((item) => [item.id, String(item.alias)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  /** `id → nombre` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly messengerName = computed(() => {
    const names = new Map<number, string>(this.messengers().map((item) => [item.id, String(item.nombre)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  /** `id → nombre` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly routeName = computed(() => {
    const names = new Map<number, string>(this.routes().map((item) => [item.id, String(item.nombre)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  /** `id → nombre` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly rateName = computed(() => {
    const names = new Map<number, string>(this.rates().map((item) => [item.id, String(item.nombre)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  /** `id → numero` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly invoiceName = computed(() => {
    const names = new Map<number, string>(this.invoices().map((item) => [item.id, String(item.numero)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  readonly dialogVisible = signal(false);
  readonly editing = signal<Shipment | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar envío' : 'Nuevo envío'));

  protected readonly humanize = humanize;

  protected readonly estadoSeverity: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
    creado: 'secondary',
    cotizado: 'info',
    asignado: 'info',
    en_ruta: 'warn',
    entregado: 'success',
    con_novedad: 'danger',
    cancelado: 'danger',
  };

  protected readonly prioridadSeverity: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
    normal: 'secondary',
    urgente: 'warn',
    express: 'danger',
  };

  constructor() {
    this.load();
  }

  /** `GET /api/shipments`: recarga la tabla y limpia el error anterior. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    // Las listas auxiliares no bloquean la carga de los registros principales.
    this.api.list().subscribe({
      next: (rows) => {
        this.rows.set(rows);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });

    this.companyApi.list().subscribe({
      next: (companies) => this.companies.set(companies),
      error: () => this.companies.set([]),
    });

    this.contactApi.list().subscribe({
      next: (contacts) => this.contacts.set(contacts),
      error: () => this.contacts.set([]),
    });

    this.addressApi.list().subscribe({
      next: (addresses) => this.addresses.set(addresses),
      error: () => this.addresses.set([]),
    });

    this.messengerApi.list().subscribe({
      next: (messengers) => this.messengers.set(messengers),
      error: () => this.messengers.set([]),
    });

    this.routeApi.list().subscribe({
      next: (routes) => this.routes.set(routes),
      error: () => this.routes.set([]),
    });

    this.rateApi.list().subscribe({
      next: (rates) => this.rates.set(rates),
      error: () => this.rates.set([]),
    });

    this.invoiceApi.list().subscribe({
      next: (invoices) => this.invoices.set(invoices),
      error: () => this.invoices.set([]),
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: Shipment): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar: `editing()` decide el verbo.
   * Tras el éxito se cierra el diálogo y se recarga (el backend es la verdad).
   */
  save(payload: ShipmentPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Envío actualizado' : 'Envío creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(row: Shipment): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${'el envío ' + row.numero_guia}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Envío desactivado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(row: Shipment): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${'el envío ' + row.numero_guia} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Envío eliminado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
