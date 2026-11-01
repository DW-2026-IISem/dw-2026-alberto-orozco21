import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forbidden',
  imports: [ButtonModule, RouterLink],
  template: `
    <main class="mx-auto grid min-h-[70vh] max-w-xl content-center justify-items-start gap-4 px-6">
      <i class="pi pi-lock text-3xl text-amber-700" aria-hidden="true"></i>
      <h1 class="m-0 text-2xl font-semibold text-slate-900">Acceso no autorizado</h1>
      <p class="m-0 text-slate-600">Tu cuenta no tiene permiso para acceder a este recurso.</p>
      <a pButton routerLink="/construir" class="mt-2">
        <i class="pi pi-arrow-left" pButtonIcon></i>
        <span pButtonLabel>Volver a operaciones</span>
      </a>
    </main>
  `,
})
export class Forbidden {}