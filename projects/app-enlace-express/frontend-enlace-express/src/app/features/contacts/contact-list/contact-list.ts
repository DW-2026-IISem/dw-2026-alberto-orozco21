import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Company } from '../../../core/models/company.model';
import { Contact, ContactPayload } from '../../../core/models/contact.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { CompanyApi } from '../../companies/company-api';
import { ContactApi } from '../contact-api';
import { ContactForm } from '../contact-form/contact-form';

@Component({
  host: { class: 'block' },
  selector: 'app-contact-list',
  imports: [ButtonModule, ContactForm, DialogModule, EmptyState, InputTextModule, MessageModule, PageHeader, StatusTag, TableModule, TagModule, TooltipModule],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.css',
})
export class ContactList {
  private readonly api = inject(ContactApi);
  private readonly companyApi = inject(CompanyApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Contact[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly companiesError = signal<string | null>(null);
  readonly filter = signal('');
  readonly companyName = computed(() => {
    const names = new Map<number, string>(this.companies().map((item) => [item.id, String(item.razon_social)]));
    return (id: number | null | undefined) => (id == null ? '—' : (names.get(id) ?? `#${id}`));
  });
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (row) => [
      row.nombre,
      row.cargo,
      row.email,
      row.telefono,
      this.companyName()(row.empresa_id),
    ]),
  );
  readonly dialogVisible = signal(false);
  readonly editing = signal<Contact | null>(null);
  readonly resetKey = signal(0);
  readonly title = computed(() => (this.editing() ? 'Editar contacto' : 'Nuevo contacto'));

  constructor() { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    // Los contactos se cargan de forma independiente del catálogo de empresas.
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
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companiesError.set(null);
    this.companyApi.list().subscribe({
      next: (companies) => this.companies.set(companies),
      error: (error: unknown) => {
        this.companies.set([]);
        this.companiesError.set(toApiMessage(error));
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(row: Contact): void {
    this.editing.set(row);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  save(payload: ContactPayload): void {
    const current = this.editing();
    this.saving.set(true);
    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Contacto actualizado' : 'Contacto creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  deactivate(row: Contact): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${row.nombre}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => this.api.deactivate(row.id).subscribe({
        next: () => { this.notify.warn('Contacto desactivado'); this.load(); },
        error: (error: unknown) => this.notify.error('No se pudo desactivar', toApiMessage(error)),
      }),
    });
  }

  remove(row: Contact): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${row.nombre} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.api.remove(row.id).subscribe({
        next: () => { this.notify.success('Contacto eliminado'); this.load(); },
        error: (error: unknown) => this.notify.error('No se pudo eliminar', toApiMessage(error)),
      }),
    });
  }
}
