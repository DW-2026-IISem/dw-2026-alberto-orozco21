import { Component, signal } from '@angular/core';
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

@Component({
  host: { class: 'block' },
  selector: 'app-construir',
  imports: [
    AddressList, Aside, ButtonModule, CardModule, CompanyList, ContactList,
    DeliveryProofList, DrawerModule, Footer, Header, InvoiceList, MessengerList,
    PackageList, RateList, RouteList, ShipmentList, TrackingEventList,
  ],
  templateUrl: './construir.html',
  styleUrl: './construir.css',
})
export class Construir {
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  readonly sidebarCollapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly title = signal('Inicio');

  readonly items: MenuItem[] = [
    { label: 'Inicio', icon: 'pi pi-home', command: () => this.seleccionar('Inicio') },
    {
      label: 'Operación',
      icon: 'pi pi-truck',
      items: [
        { label: 'Empresas', icon: 'pi pi-building', command: () => this.seleccionar('Empresas') },
        { label: 'Contactos', icon: 'pi pi-id-card', command: () => this.seleccionar('Contactos') },
        { label: 'Direcciones', icon: 'pi pi-map-marker', command: () => this.seleccionar('Direcciones') },
        { label: 'Mensajeros', icon: 'pi pi-send', command: () => this.seleccionar('Mensajeros') },
        { label: 'Tarifas', icon: 'pi pi-dollar', command: () => this.seleccionar('Tarifas') },
        { label: 'Rutas', icon: 'pi pi-map', command: () => this.seleccionar('Rutas') },
        { label: 'Envíos', icon: 'pi pi-box', command: () => this.seleccionar('Envíos') },
        { label: 'Paquetes', icon: 'pi pi-inbox', command: () => this.seleccionar('Paquetes') },
        {
          label: 'Eventos de seguimiento',
          icon: 'pi pi-history',
          command: () => this.seleccionar('Eventos de seguimiento'),
        },
        {
          label: 'Comprobantes de entrega',
          icon: 'pi pi-check-square',
          command: () => this.seleccionar('Comprobantes de entrega'),
        },
        { label: 'Facturas', icon: 'pi pi-file', command: () => this.seleccionar('Facturas') },
      ],
    },
    {
      label: 'Administración',
      icon: 'pi pi-shield',
      items: [
        { label: 'Usuarios', icon: 'pi pi-users', command: () => this.seleccionar('Usuarios') },
        { label: 'Roles', icon: 'pi pi-key', command: () => this.seleccionar('Roles') },
        { label: 'Recursos', icon: 'pi pi-list', command: () => this.seleccionar('Recursos') },
        {
          label: 'Asignaciones de rol',
          icon: 'pi pi-user-plus',
          command: () => this.seleccionar('Asignaciones de rol'),
        },
        {
          label: 'Concesiones de recursos',
          icon: 'pi pi-lock',
          command: () => this.seleccionar('Concesiones de recursos'),
        },
        { label: 'Sesiones', icon: 'pi pi-history', command: () => this.seleccionar('Sesiones') },
      ],
    },
  ];

  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }
    this.mobileOpen.set(true);
  }

  protected seleccionar(titulo: string): void {
    this.title.set(titulo);
    this.mobileOpen.set(false);
  }
}
