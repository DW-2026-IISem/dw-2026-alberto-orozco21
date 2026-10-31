import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Address } from '../../../core/models/address.model';
import { Company, CompanyPayload } from '../../../core/models/company.model';
import { Contact } from '../../../core/models/contact.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { AddressApi } from '../../addresses/address-api';
import { ContactApi } from '../../contacts/contact-api';
import { CompanyApi } from '../company-api';
import { CompanyForm } from '../company-form/company-form';

@Component({
  host: { class: 'block' },
  selector: 'app-company-list',
  imports: [ButtonModule, CompanyForm, DialogModule, EmptyState, InputTextModule, MessageModule, PageHeader, StatusTag, TableModule, TagModule, TooltipModule],
  templateUrl: './company-list.html',
  styleUrl: './company-list.css',
})
export class CompanyList {
  private readonly api = inject(CompanyApi);
  private readonly contactApi = inject(ContactApi);
  private readonly addressApi = inject(AddressApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Company[]>([]);
  readonly contacts = signal<Contact[]>([]);
  readonly addresses = signal<Address[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly contactName = computed(() => {
    const names = new Map<number, string>(this.contacts().map((item) => [item.id, String(item.nombre)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });
  readonly addressName = computed(() => {
    const names = new Map<number, string>(this.addresses().map((item) => [item.id, String(item.alias)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.nit,
      row.razon_social,
      this.contactName()(row.contacto_principal_id),
      this.addressName()(row.direccion_facturacion_id),
    ]),
  );
  readonly dialogVisible = signal(false);
  readonly editing = signal<Company | null>(null);
  readonly resetKey = signal(0);
  readonly title = computed(() => (this.editing() ? 'Editar empresa' : 'Nueva empresa'));

  constructor() { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    // Las listas auxiliares no deben impedir que se muestren las empresas.
    // Cada recurso falla de forma independiente y se puede recuperar al recargar.
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

    this.contactApi.list().subscribe({
      next: (contacts) => this.contacts.set(contacts),
      error: () => this.contacts.set([]),
    });

    this.addressApi.list().subscribe({
      next: (addresses) => this.addresses.set(addresses),
      error: () => this.addresses.set([]),
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: Company): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  save(payload: CompanyPayload): void {
    const current = this.editing();
    this.saving.set(true);
    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Empresa actualizada' : 'Empresa creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  deactivate(row: Company): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${row.razon_social}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle', acceptLabel: 'Desactivar', rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => this.api.deactivate(row.id).subscribe({
        next: () => { this.notify.warn('Empresa desactivada'); this.load(); },
        error: (error: unknown) => this.notify.error('No se pudo desactivar', toApiMessage(error)),
      }),
    });
  }

  remove(row: Company): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${row.razon_social} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash', acceptLabel: 'Eliminar', rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.api.remove(row.id).subscribe({
        next: () => { this.notify.success('Empresa eliminada'); this.load(); },
        error: (error: unknown) => this.notify.error('No se pudo eliminar', toApiMessage(error)),
      }),
    });
  }
}
