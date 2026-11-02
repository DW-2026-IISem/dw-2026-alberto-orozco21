import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HttpMethod, Resource } from '../../../../core/models/resource.model';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Role } from '../../../../core/models/role.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../../resources/resource-api';
import { RoleApi } from '../../roles/role-api';
import { ResourceRoleApi } from '../resource-role-api';

@Component({
  host: { class: 'block' },
  selector: 'app-resource-role-list',
  imports: [
    ButtonModule, DialogModule, EmptyState, FormsModule, HasPermission, MessageModule,
    PageHeader, ReactiveFormsModule, SelectModule, StatusTag, TableModule, TagModule,
  ],
  templateUrl: './resource-role-list.html',
})
export class ResourceRoleList {
  private readonly api = inject(ResourceRoleApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly resourcesApi = inject(ResourceApi);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly confirmation = inject(ConfirmationService);
  private readonly notifications = inject(NotificationService);
  readonly session = inject(SessionStore);

  readonly rows = signal<ResourceRole[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly referencesError = signal<string | null>(null);
  readonly roleFilter = signal<number | null>(null);
  readonly resourceFilter = signal<number | null>(null);
  readonly filter = signal('');
  readonly visibleRows = computed(() => {
    const roleId = this.roleFilter();
    const resourceId = this.resourceFilter();
    return filterRows(this.rows(), this.filter(), (row) => {
      const resource = this.resources().find((item) => item.id === row.resource_id);
      const role = this.roles().find((item) => item.id === row.role_id);
      return [resource?.path, resource?.method, resource?.description, role?.name];
    }).filter((row) =>
      (!roleId || row.role_id === roleId) &&
      (!resourceId || row.resource_id === resourceId),
    );
  });
  readonly activeRoles = computed(() => this.roles().filter((role) => role.status === 'active'));
  readonly activeResources = computed(() => this.resources().filter((resource) => resource.status === 'active'));
  readonly roleNames = computed(() => new Map(this.roles().map((role) => [role.id, role.name])));
  readonly resourceById = computed(() => new Map(this.resources().map((resource) => [resource.id, resource])));
  readonly canGrant = computed(() =>
    this.session.canPermission('POST /api/concesiones-rol') &&
    this.session.canPermission('GET /api/roles') &&
    this.session.canPermission('GET /api/recursos'),
  );
  readonly dialogVisible = signal(false);
  readonly form = this.fb.group({
    role_id: [0, [Validators.required, Validators.min(1)]],
    resource_id: [0, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
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

    this.referencesError.set(null);
    if (this.session.canPermission('GET /api/roles')) {
      this.rolesApi.list().subscribe({
        next: (roles) => this.roles.set(roles),
        error: (error: unknown) => this.referencesError.set(toApiMessage(error)),
      });
    } else {
      this.roles.set([]);
    }
    if (this.session.canPermission('GET /api/recursos')) {
      this.resourcesApi.list().subscribe({
        next: (resources) => this.resources.set(resources),
        error: (error: unknown) => this.referencesError.set(toApiMessage(error)),
      });
    } else {
      this.resources.set([]);
    }
  }

  openCreate(): void {
    this.form.reset({ role_id: 0, resource_id: 0 });
    this.dialogVisible.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.api.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notifications.success('Concesión guardada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notifications.error('No se pudo conceder el recurso', toApiMessage(error));
      },
    });
  }

  deactivate(row: ResourceRole): void {
    const resource = this.resourceById().get(row.resource_id);
    this.confirmation.confirm({
      header: 'Retirar concesión',
      message: `¿Retirar ${resource?.method ?? ''} ${resource?.path ?? `recurso #${row.resource_id}`} del rol ${this.roleNames().get(row.role_id) ?? `#${row.role_id}`}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      accept: () => this.api.deactivate(row.id).subscribe({
        next: () => {
          this.notifications.warn('Concesión retirada');
          this.load();
        },
        error: (error: unknown) => this.notifications.error('No se pudo retirar la concesión', toApiMessage(error)),
      }),
    });
  }

  reactivate(row: ResourceRole): void {
    this.api.reactivate(row.id).subscribe({
      next: () => {
        this.notifications.success('Concesión reactivada');
        this.load();
      },
      error: (error: unknown) => this.notifications.error('No se pudo reactivar la concesión', toApiMessage(error)),
    });
  }

  methodSeverity(method: HttpMethod | undefined): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
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