import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Status } from '../../../../core/models/api.model';
import { Role } from '../../../../core/models/role.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi } from '../role-api';

@Component({
  host: { class: 'block' },
  selector: 'app-role-list',
  imports: [
    ButtonModule, DialogModule, EmptyState, HasPermission, InputTextModule, MessageModule,
    PageHeader, ReactiveFormsModule, SelectModule, StatusTag, TableModule, TagModule,
  ],
  templateUrl: './role-list.html',
})
export class RoleList {
  private readonly api = inject(RoleApi);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly confirmation = inject(ConfirmationService);
  private readonly notifications = inject(NotificationService);

  readonly rows = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (role) => [role.name, role.description, role.status]),
  );
  readonly dialogVisible = signal(false);
  readonly editing = signal<Role | null>(null);
  readonly activeOptions = [
    { label: 'Activo', value: 'active' as Status },
    { label: 'Inactivo', value: 'inactive' as Status },
  ];
  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    description: [''],
    status: ['active' as Status, Validators.required],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: (roles) => {
        this.rows.set(roles);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.form.reset({ name: '', description: '', status: 'active' });
    this.form.controls.status.enable();
    this.dialogVisible.set(true);
  }

  openEdit(role: Role): void {
    this.editing.set(role);
    this.form.reset({
      name: role.name,
      description: role.description ?? '',
      status: role.status,
    });
    this.form.controls.status.disable();
    this.dialogVisible.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const current = this.editing();
    const value = this.form.getRawValue();
    const payload = {
      name: value.name.trim().toUpperCase(),
      description: value.description.trim() || null,
    };
    const request = current
      ? this.api.update(current.id, payload)
      : this.api.create({ ...payload, status: value.status });

    this.saving.set(true);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notifications.success(current ? 'Rol actualizado' : 'Rol creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notifications.error('No se pudo guardar el rol', toApiMessage(error));
      },
    });
  }

  deactivate(role: Role): void {
    this.confirmation.confirm({
      header: 'Desactivar rol',
      message: `¿Desactivar ${role.name}? Sus asignaciones dejarán de conceder permisos.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      accept: () => this.api.deactivate(role.id).subscribe({
        next: () => {
          this.notifications.warn('Rol desactivado');
          this.load();
        },
        error: (error: unknown) => this.notifications.error('No se pudo desactivar', toApiMessage(error)),
      }),
    });
  }

  remove(role: Role): void {
    this.confirmation.confirm({
      header: 'Eliminar rol',
      message: `Se eliminará ${role.name}. Revisa sus asignaciones antes de continuar.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.api.remove(role.id).subscribe({
        next: () => {
          this.notifications.success('Rol eliminado');
          this.load();
        },
        error: (error: unknown) => this.notifications.error('No se pudo eliminar', toApiMessage(error)),
      }),
    });
  }
}