import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

/**
 * Componente principal (`<app-root>`).
 *
 * Punto de entrada: el router selecciona qué pantalla se dibuja en su outlet.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogModule, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
