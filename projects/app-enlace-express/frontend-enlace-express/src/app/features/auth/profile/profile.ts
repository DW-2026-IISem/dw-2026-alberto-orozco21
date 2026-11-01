import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth-service';
import { NotificationService } from '../../../core/services/notification';
import { SessionStore } from '../../../core/services/session-store';

@Component({
  selector: 'app-profile',
  imports: [ButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  readonly session = inject(SessionStore);
  readonly refreshing = signal(false);

  refresh(): void {
    this.refreshing.set(true);
    this.auth.me().subscribe({
      next: () => {
        this.refreshing.set(false);
        this.notifications.success('Sesión sincronizada', 'Perfil y permisos recargados.');
      },
      error: () => this.refreshing.set(false),
    });
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      this.notifications.info('Sesión cerrada');
      void this.router.navigate(['/login']);
    });
  }
}