import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Role } from '../../../../core/models/role.model';
import { RoleUser } from '../../../../core/models/role-user.model';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi } from '../../roles/role-api';
import { UserApi } from '../../users/user-api';
import { RoleUserApi } from '../role-user-api';

@Component({
  host: { class: 'block' },
  selector: 'app-role-user-list',
  imports: [
    ButtonModule, DatePipe, DialogModule, EmptyState, FormsModule, HasPermission, MessageModule,
    PageHeader, ReactiveFormsModule, SelectModule, StatusTag, TableModule, TagModule,
  ],
  templateUrl: './role-user-list.html',
})
export class RoleUserList {
  private readonly api = inject(RoleUserApi);
  private readonly usersApi = inject(UserApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly confirmation = inject(ConfirmationService);
  private readonly notifications = inject(NotificationService);
  readonly session = inject(SessionStore);

  readonly rows = signal<RoleUser[]>([]);
  readonly users = signal<User[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly referencesError = signal<string | null>(null);
  readonly userFilter = signal<number | null>(null);
  readonly roleFilter = signal<number | null>(null);
  readonly visibleRows = computed(() => {
    const userId = this.userFilter();
    const roleId = this.roleFilter();
    return this.rows().filter(
      (row) => (!userId || row.user_id === userId) && (!roleId || row.role_id === roleId),
    );
  });
  readonly userNames = computed(() => new Map(this.users().map((user) => [user.id, user.username])));
  readonly roleNames = computed(() => new Map(this.roles().map((role) => [role.id, role.name])));
  readonly activeUsers = computed(() => this.users().filter((user) => user.status === 'active'));
  readonly activeRoles = computed(() => this.roles().filter((role) => role.status === 'active'));
  readonly canAssign = computed(() =>
    this.session.canPermission('POST /api/asignaciones-rol') &&
    this.session.canPermission('GET /api/usuarios') &&
    this.session.canPermission('GET /api/roles'),
  );
  readonly dialogVisible = signal(false);
  readonly form = this.fb.group({
    user_id: [0, [Validators.required, Validators.min(1)]],
    role_id: [0, [Validators.required, Validators.min(1)]],
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
    if (this.session.canPermission('GET /api/usuarios')) {
      this.usersApi.list().subscribe({
        next: (users) => this.users.set(users),
        error: (error: unknown) => this.referencesError.set(toApiMessage(error)),
      });
    } else {
      this.users.set([]);
    }
    if (this.session.canPermission('GET /api/roles')) {
      this.rolesApi.list().subscribe({
        next: (roles) => this.roles.set(roles),
        error: (error: unknown) => this.referencesError.set(toApiMessage(error)),
      });
    } else {
      this.roles.set([]);
    }
  }

  openCreate(): void {
    this.form.reset({ user_id: 0, role_id: 0 });
    this.dialogVisible.set(true);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    this.saving.set(true);
    this.api.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notifications.success('Asignación guardada', 'Si ya existía inactiva, el backend la reactiva.');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notifications.error('No se pudo asignar el rol', toApiMessage(error));
      },
    });
  }

  deactivate(row: RoleUser): void {
    this.confirmation.confirm({
      header: 'Retirar rol',
      message: `¿Retirar el rol ${this.roleNames().get(row.role_id) ?? `#${row.role_id}`} del usuario ${this.userNames().get(row.user_id) ?? `#${row.user_id}`}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      accept: () => this.api.deactivate(row.id).subscribe({
        next: () => {
          this.notifications.warn('Rol retirado');
          this.load();
        },
        error: (error: unknown) => this.notifications.error('No se pudo retirar el rol', toApiMessage(error)),
      }),
    });
  }

  reactivate(row: RoleUser): void {
    this.api.reactivate(row.id).subscribe({
      next: () => {
        this.notifications.success('Asignación reactivada');
        this.load();
      },
      error: (error: unknown) => this.notifications.error('No se pudo reactivar la asignación', toApiMessage(error)),
    });
  }
}