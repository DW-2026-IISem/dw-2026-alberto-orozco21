import { Component } from '@angular/core';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

@Component({
  host: { class: 'block' },
  selector: 'app-shipment-list',
  imports: [EmptyState, PageHeader],
  templateUrl: './shipment-list.html',
  styleUrl: './shipment-list.css',
})
export class ShipmentList {}