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
import { TooltipModule } from 'primeng/tooltip';
import { EffectivePermission } from '../../../../core/models/auth.model';
import { Status } from '../../../../core/models/api.model';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { UserApi } from '../user-api';

@Component({
  host: { class: 'block' },
  selector: 'app-user-list',
  imports: [
    ButtonModule, DialogModule, EmptyState, HasPermission, InputTextModule, MessageModule,
    PageHeader, ReactiveFormsModule, SelectModule, StatusTag, TableModule, TagModule, TooltipModule,
  ],
  templateUrl: './user-list.html',
})
export class UserList {
  private readonly api = inject(UserApi);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly confirmation = inject(ConfirmationService);
  private readonly notifications = inject(NotificationService);
  readonly session = inject(SessionStore);

  readonly rows = signal<User[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (user) => [user.username, user.email, user.status]),
  );
  readonly dialogVisible = signal(false);
  readonly editing = signal<User | null>(null);
  readonly permissionDialogVisible = signal(false);
  readonly permissionUser = signal<User | null>(null);
  readonly effectivePermissions = signal<EffectivePermission[]>([]);
  readonly permissionLoading = signal(false);
  readonly permissionError = signal<string | null>(null);
  readonly activeOptions = [
    { label: 'Activo', value: 'active' as Status },
    { label: 'Inactivo', value: 'inactive' as Status },
  ];
  readonly form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    avatar: [''],
    status: ['active' as Status, Validators.required],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.list().subscribe({
      next: (users) => {
        this.rows.set(users);
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
    this.form.reset({ username: '', email: '', password: '', avatar: '', status: 'active' });
    this.form.controls.password.enable();
    this.form.controls.password.setValidators([Validators.required, Validators.minLength(8)]);
    this.form.controls.status.enable();
    this.dialogVisible.set(true);
  }

  openEdit(user: User): void {
    this.editing.set(user);
    this.form.reset({
      username: user.username,
      email: user.email,
      password: '',
      avatar: user.avatar ?? '',
      status: user.status,
    });
    this.form.controls.password.clearValidators();
    this.form.controls.password.disable();
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
    const common = {
      username: value.username.trim(),
      email: value.email.trim(),
      avatar: value.avatar.trim() || null,
    };
    const request = current
      ? this.api.update(current.id, common)
      : this.api.create({ ...common, password: value.password, status: value.status });

    this.saving.set(true);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notifications.success(current ? 'Usuario actualizado' : 'Usuario creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notifications.error('No se pudo guardar el usuario', toApiMessage(error));
      },
    });
  }

  openPermissions(user: User): void {
    this.permissionUser.set(user);
    this.effectivePermissions.set([]);
    this.permissionError.set(null);
    this.permissionLoading.set(true);
    this.permissionDialogVisible.set(true);
    this.api.permissions(user.id).subscribe({
      next: (permissions) => {
        if (this.permissionUser()?.id === user.id) {
          this.effectivePermissions.set(permissions);
          this.permissionLoading.set(false);
        }
      },
      error: (error: unknown) => {
        if (this.permissionUser()?.id === user.id) {
          this.permissionError.set(toApiMessage(error));
          this.permissionLoading.set(false);
        }
      },
    });
  }

  isSelf(user: User): boolean {
    return this.session.user()?.id === user.id;
  }

  deactivate(user: User): void {
    this.confirmation.confirm({
      header: 'Desactivar usuario',
      message: `¿Desactivar la cuenta de ${user.username}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      accept: () => this.api.deactivate(user.id).subscribe({
        next: () => {
          this.notifications.warn('Usuario desactivado');
          this.load();
        },
        error: (error: unknown) => this.notifications.error('No se pudo desactivar', toApiMessage(error)),
      }),
    });
  }

  remove(user: User): void {
    this.confirmation.confirm({
      header: 'Eliminar usuario',
      message: `Se eliminará la cuenta de ${user.username}. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.api.remove(user.id).subscribe({
        next: () => {
          this.notifications.success('Usuario eliminado');
          this.load();
        },
        error: (error: unknown) => this.notifications.error('No se pudo eliminar', toApiMessage(error)),
      }),
    });
  }
}