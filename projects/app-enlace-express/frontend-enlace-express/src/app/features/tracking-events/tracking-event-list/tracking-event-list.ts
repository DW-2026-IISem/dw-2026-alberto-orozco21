import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TrackingEvent, TrackingEventPayload } from '../../../core/models/tracking-event.model';
import { Shipment } from '../../../core/models/shipment.model';
import { Messenger } from '../../../core/models/messenger.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { humanize } from '../../../core/utils/labels';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ShipmentApi } from '../../shipments/shipment-api';
import { MessengerApi } from '../../messengers/messenger-api';
import { TrackingEventApi } from '../tracking-event-api';
import { TrackingEventForm } from '../tracking-event-form/tracking-event-form';

/**
 * Lista de eventos de seguimiento con todas las operaciones del CRUD.
 *
 * Todo el estado vive en signals: la tabla y los contadores se repintan solos y
 * `visibleRows` se recalcula solo cuando cambian `rows()` o `filter()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-tracking-event-list',
  imports: [ButtonModule, DatePipe, DialogModule, EmptyState, HasPermission, InputTextModule, MessageModule, PageHeader, StatusTag, TableModule, TagModule, TooltipModule, TrackingEventForm],
  templateUrl: './tracking-event-list.html',
  styleUrl: './tracking-event-list.css',
})
export class TrackingEventList {
  private readonly api = inject(TrackingEventApi);
  private readonly shipmentApi = inject(ShipmentApi);
  private readonly messengerApi = inject(MessengerApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/tracking_events`). */
  readonly rows = signal<TrackingEvent[]>([]);
  readonly shipments = signal<Shipment[]>([]);
  readonly messengers = signal<Messenger[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador; `computed` lo memoriza. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.tipo,
      row.ubicacion,
      row.observaciones,
      row.estado,
      this.shipmentName()(row.envio_id),
      this.messengerName()(row.registrado_por_id),
    ]),
  );

  /** `id → numero_guia` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly shipmentName = computed(() => {
    const names = new Map<number, string>(this.shipments().map((item) => [item.id, String(item.numero_guia)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  /** `id → nombre` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly messengerName = computed(() => {
    const names = new Map<number, string>(this.messengers().map((item) => [item.id, String(item.nombre)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  readonly dialogVisible = signal(false);
  readonly editing = signal<TrackingEvent | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar evento de seguimiento' : 'Nuevo evento de seguimiento'));

  protected readonly humanize = humanize;

  protected readonly estadoSeverity: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
    informativo: 'info',
    novedad_leve: 'warn',
    novedad_critica: 'danger',
  };

  constructor() {
    this.load();
  }

  /** `GET /api/tracking_events`: recarga la tabla y limpia el error anterior. */
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

    this.shipmentApi.list().subscribe({
      next: (shipments) => this.shipments.set(shipments),
      error: () => this.shipments.set([]),
    });

    this.messengerApi.list().subscribe({
      next: (messengers) => this.messengers.set(messengers),
      error: () => this.messengers.set([]),
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: TrackingEvent): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar: `editing()` decide el verbo.
   * Tras el éxito se cierra el diálogo y se recarga (el backend es la verdad).
   */
  save(payload: TrackingEventPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Evento de seguimiento actualizado' : 'Evento de seguimiento creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(row: TrackingEvent): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${'el evento #' + row.id}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Evento de seguimiento desactivado');
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
  remove(row: TrackingEvent): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${'el evento #' + row.id} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Evento de seguimiento eliminado');
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
