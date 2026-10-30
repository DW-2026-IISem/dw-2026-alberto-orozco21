import { Component, input } from '@angular/core';

@Component({
  host: { class: 'block' },
  selector: 'app-empty-state',
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  readonly icon = input('pi pi-inbox');
  readonly title = input('Sin registros');
  readonly message = input('Todavía no hay datos para mostrar.');
}