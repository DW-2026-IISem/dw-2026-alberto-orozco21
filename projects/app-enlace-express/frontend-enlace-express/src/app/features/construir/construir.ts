import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DrawerModule } from 'primeng/drawer';
import { watchMediaQuery } from '../../core/utils/media-query';
import { Aside } from '../../layout/aside/aside';
import { Footer } from '../../layout/footer/footer';
import { Header } from '../../layout/header/header';
import { CompanyList } from '../companies/company-list/company-list';
import { ContactList } from '../contacts/contact-list/contact-list';
import { AddressList } from '../addresses/address-list/address-list';
import { DeliveryProofList } from '../delivery-proofs/delivery-proof-list/delivery-proof-list';
import { InvoiceList } from '../invoices/invoice-list/invoice-list';
import { MessengerList } from '../messengers/messenger-list/messenger-list';
import { PackageList } from '../packages/package-list/package-list';
import { RateList } from '../rates/rate-list/rate-list';
import { RouteList } from '../routes/route-list/route-list';
import { ShipmentList } from '../shipments/shipment-list/shipment-list';
import { TrackingEventList } from '../tracking-events/tracking-event-list/tracking-event-list';
import { UserList } from '../admin/users/user-list/user-list';
import { RoleList } from '../admin/roles/role-list/role-list';
import { ResourceList } from '../admin/resources/resource-list/resource-list';
import { RoleUserList } from '../admin/role-users/role-user-list/role-user-list';
import { ResourceRoleList } from '../admin/resource-roles/resource-role-list/resource-role-list';
import { AuthService } from '../../core/services/auth-service';
import { NotificationService } from '../../core/services/notification';
import { SessionStore } from '../../core/services/session-store';
import { Dashboard } from '../dashboard/dashboard';

const BUSINESS_SECTIONS = [
  { label: 'Empresas', icon: 'pi pi-building', permission: 'GET /api/companies' },
  { label: 'Contactos', icon: 'pi pi-id-card', permission: 'GET /api/contacts' },
  { label: 'Direcciones', icon: 'pi pi-map-marker', permission: 'GET /api/address' },
  { label: 'Mensajeros', icon: 'pi pi-send', permission: 'GET /api/messengers' },
  { label: 'Tarifas', icon: 'pi pi-dollar', permission: 'GET /api/rates' },
  { label: 'Rutas', icon: 'pi pi-map', permission: 'GET /api/routes' },
  { label: 'Envíos', icon: 'pi pi-box', permission: 'GET /api/shipments' },
  { label: 'Paquetes', icon: 'pi pi-inbox', permission: 'GET /api/packages' },
  { label: 'Eventos de seguimiento', icon: 'pi pi-history', permission: 'GET /api/tracking_events' },
  { label: 'Comprobantes de entrega', icon: 'pi pi-check-square', permission: 'GET /api/delivery_proofs' },
  { label: 'Facturas', icon: 'pi pi-file', permission: 'GET /api/invoices' },
] as const;

const ADMIN_SECTIONS = [
  { label: 'Usuarios', icon: 'pi pi-users', permission: 'GET /api/usuarios' },
  { label: 'Roles', icon: 'pi pi-key', permission: 'GET /api/roles' },
  { label: 'Recursos', icon: 'pi pi-list', permission: 'GET /api/recursos' },
  { label: 'Asignaciones de rol', icon: 'pi pi-user-plus', permission: 'GET /api/asignaciones-rol' },
  { label: 'Concesiones de recursos', icon: 'pi pi-lock', permission: 'GET /api/concesiones-rol' },
] as const;

@Component({
  host: { class: 'block' },
  selector: 'app-construir',
  imports: [
    AddressList, Aside, ButtonModule, CardModule, CompanyList, ContactList, Dashboard,
    DeliveryProofList, DrawerModule, Footer, Header, InvoiceList, MessengerList,
    PackageList, RateList, RouteList, ShipmentList, TrackingEventList,
    UserList, RoleList, ResourceList, RoleUserList, ResourceRoleList,
  ],
  templateUrl: './construir.html',
  styleUrl: './construir.css',
})
export class Construir {
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);
  readonly session = inject(SessionStore);

  readonly sidebarCollapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly title = signal('Inicio');
  readonly userItems: MenuItem[] = [
    { label: 'Mi perfil', icon: 'pi pi-user', command: () => void this.router.navigate(['/perfil']) },
    { label: 'Actualizar permisos', icon: 'pi pi-sync', command: () => this.refreshSession() },
    { separator: true },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  readonly items = computed<MenuItem[]>(() => {
    const operationItems = BUSINESS_SECTIONS
      .filter((section) => this.session.canPermission(section.permission))
      .map<MenuItem>((section) => ({
        label: section.label,
        icon: section.icon,
        command: () => this.seleccionar(section.label),
      }));
    const items: MenuItem[] = [
      { label: 'Inicio', icon: 'pi pi-home', command: () => this.seleccionar('Inicio') },
    ];

    if (operationItems.length > 0) {
      items.push({ label: 'Operación', icon: 'pi pi-truck', items: operationItems });
    }

    const securityItems = this.session.authEnabled
      ? ADMIN_SECTIONS
          .filter((section) => this.session.canPermission(section.permission))
          .map<MenuItem>((section) => ({
            label: section.label,
            icon: section.icon,
            command: () => this.seleccionar(section.label),
          }))
      : [];
    if (securityItems.length > 0) {
      items.push({ label: 'Seguridad', icon: 'pi pi-shield', items: securityItems });
    }

    return items;
  });

  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }
    this.mobileOpen.set(true);
  }

  protected seleccionar(titulo: string): void {
    const section = BUSINESS_SECTIONS.find((item) => item.label === titulo);
    if (section && !this.session.canPermission(section.permission)) {
      void this.router.navigate(['/forbidden'], {
        queryParams: { permission: section.permission },
      });
      return;
    }
    const adminSection = ADMIN_SECTIONS.find((item) => item.label === titulo);
    if (adminSection && (!this.session.authEnabled || !this.session.canPermission(adminSection.permission))) {
      void this.router.navigate(['/forbidden'], {
        queryParams: { permission: adminSection.permission },
      });
      return;
    }

    this.title.set(titulo);
    this.mobileOpen.set(false);
  }

  protected onDashboardSectionRequested(titulo: 'Empresas' | 'Envíos' | 'Facturas'): void {
    this.seleccionar(titulo);
  }

  private refreshSession(): void {
    this.auth.me().subscribe({
      next: () => this.notifications.success('Sesión sincronizada', 'Perfil y permisos recargados.'),
    });
  }

  protected logout(): void {
    this.auth.logout().subscribe(() => {
      this.notifications.info('Sesión cerrada');
      void this.router.navigate(['/login']);
    });
  }
}
