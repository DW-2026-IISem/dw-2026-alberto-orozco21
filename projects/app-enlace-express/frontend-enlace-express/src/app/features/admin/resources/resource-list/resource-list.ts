import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Status } from '../../../../core/models/api.model';
import { HTTP_METHODS, HttpMethod, Resource } from '../../../../core/models/resource.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../resource-api';

@Component({
  host: { class: 'block' },
  selector: 'app-resource-list',
  imports: [
    ButtonModule, DialogModule, EmptyState, FormsModule, HasPermission, InputTextModule,
    MessageModule, PageHeader, ReactiveFormsModule, SelectModule, StatusTag, TableModule,
    TagModule, TooltipModule,
  ],
  templateUrl: './resource-list.html',
})
export class ResourceList {
  private readonly api = inject(ResourceApi);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly confirmation = inject(ConfirmationService);
  private readonly notifications = inject(NotificationService);

  readonly rows = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly methodFilter = signal<HttpMethod | null>(null);
  readonly methodOptions = [
    { label: 'Todos los métodos', value: null },
    ...HTTP_METHODS.map((method) => ({ label: method, value: method })),
  ];
  readonly methodCounts = computed(() =>
    HTTP_METHODS.map((method) => ({
      method,
      count: this.rows().filter((resource) => resource.method === method).length,
    })),
  );
  readonly visibleRows = computed(() => {
    const matches = filterRows(this.rows(), this.filter(), (resource) => [
      resource.path,
      resource.method,
      resource.description,
    ]);
    const method = this.methodFilter();
    return method ? matches.filter((resource) => resource.method === method) : matches;
  });
  readonly dialogVisible = signal(false);
  readonly editing = signal<Resource | null>(null);
  readonly activeOptions = [
    { label: 'Activo', value: 'active' as Status },
    { label: 'Inactivo', value: 'inactive' as Status },
  ];
  readonly form = this.fb.group({
    path: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^\/.+/)]],
    method: ['GET' as HttpMethod, Validators.required],
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
      next: (resources) => {
        this.rows.set(resources);
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
    this.form.reset({ path: '', method: 'GET', description: '', status: 'active' });
    this.form.controls.status.enable();
    this.dialogVisible.set(true);
  }

  openEdit(resource: Resource): void {
    this.editing.set(resource);
    this.form.reset({
      path: resource.path,
      method: resource.method,
      description: resource.description ?? '',
      status: resource.status,
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
      path: value.path.trim(),
      method: value.method,
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
        this.notifications.success(current ? 'Recurso actualizado' : 'Recurso creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notifications.error('No se pudo guardar el recurso', toApiMessage(error));
      },
    });
  }

  deactivate(resource: Resource): void {
    this.confirmation.confirm({
      header: 'Desactivar recurso',
      message: `¿Desactivar ${resource.method} ${resource.path}? Las concesiones dejarán de autorizarlo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      accept: () => this.api.deactivate(resource.id).subscribe({
        next: () => {
          this.notifications.warn('Recurso desactivado');
          this.load();
        },
        error: (error: unknown) => this.notifications.error('No se pudo desactivar', toApiMessage(error)),
      }),
    });
  }

  remove(resource: Resource): void {
    this.confirmation.confirm({
      header: 'Eliminar recurso definitivamente',
      message: `Eliminar ${resource.method} ${resource.path} puede romper concesiones históricas. Se recomienda desactivarlo.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.api.remove(resource.id).subscribe({
        next: () => {
          this.notifications.success('Recurso eliminado');
          this.load();
        },
        error: (error: unknown) => this.notifications.error('No se pudo eliminar', toApiMessage(error)),
      }),
    });
  }

  methodSeverity(method: HttpMethod): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
    switch (method) {
      case 'GET': return 'info';
      case 'POST': return 'success';
      case 'PUT':
      case 'PATCH': return 'warn';
      case 'DELETE': return 'danger';
      default: return 'secondary';
    }
  }
}