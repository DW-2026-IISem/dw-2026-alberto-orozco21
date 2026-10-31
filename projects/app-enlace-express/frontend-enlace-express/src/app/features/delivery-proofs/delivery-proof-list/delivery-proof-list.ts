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
import { DeliveryProof, DeliveryProofPayload } from '../../../core/models/delivery-proof.model';
import { Shipment } from '../../../core/models/shipment.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { humanize } from '../../../core/utils/labels';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ShipmentApi } from '../../shipments/shipment-api';
import { DeliveryProofApi } from '../delivery-proof-api';
import { DeliveryProofForm } from '../delivery-proof-form/delivery-proof-form';

/**
 * Lista de comprobantes de entrega con todas las operaciones del CRUD.
 *
 * Todo el estado vive en signals: la tabla y los contadores se repintan solos y
 * `visibleRows` se recalcula solo cuando cambian `rows()` o `filter()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-delivery-proof-list',
  imports: [ButtonModule, DatePipe, DeliveryProofForm, DialogModule, EmptyState, InputTextModule, MessageModule, PageHeader, StatusTag, TableModule, TagModule, TooltipModule],
  templateUrl: './delivery-proof-list.html',
  styleUrl: './delivery-proof-list.css',
})
export class DeliveryProofList {
  private readonly api = inject(DeliveryProofApi);
  private readonly shipmentApi = inject(ShipmentApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend (`GET /api/delivery_proofs`). */
  readonly rows = signal<DeliveryProof[]>([]);
  readonly shipments = signal<Shipment[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador; `computed` lo memoriza. */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.receptor_nombre,
      row.receptor_documento,
      row.estado,
      this.shipmentName()(row.envio_id),
    ]),
  );

  /** `id → numero_guia` para mostrar el nombre en la tabla sin buscar en el arreglo por cada fila. */
  readonly shipmentName = computed(() => {
    const names = new Map<number, string>(this.shipments().map((item) => [item.id, String(item.numero_guia)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });

  readonly dialogVisible = signal(false);
  readonly editing = signal<DeliveryProof | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar comprobante de entrega' : 'Nuevo comprobante de entrega'));

  protected readonly humanize = humanize;

  protected readonly estadoSeverity: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
    valida: 'success',
    observada: 'warn',
    rechazada: 'danger',
  };

  constructor() {
    this.load();
  }

  /** `GET /api/delivery_proofs`: recarga la tabla y limpia el error anterior. */
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
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: DeliveryProof): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar: `editing()` decide el verbo.
   * Tras el éxito se cierra el diálogo y se recarga (el backend es la verdad).
   */
  save(payload: DeliveryProofPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Comprobante de entrega actualizado' : 'Comprobante de entrega creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(row: DeliveryProof): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${'el comprobante #' + row.id}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Comprobante de entrega desactivado');
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
  remove(row: DeliveryProof): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${'el comprobante #' + row.id} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(row.id).subscribe({
          next: () => {
            this.notify.success('Comprobante de entrega eliminado');
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
