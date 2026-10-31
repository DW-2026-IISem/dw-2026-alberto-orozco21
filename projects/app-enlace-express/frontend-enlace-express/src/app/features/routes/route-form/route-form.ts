import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Route, RoutePayload, RouteStatus } from '../../../core/models/route.model';
import { Messenger } from '../../../core/models/messenger.model';
import { toDateInput, toTimeInput } from '../../../core/utils/form-values';

/**
 * Formulario de ruta, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `route` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-route-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './route-form.html',
  styleUrl: './route-form.css',
})
export class RouteForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly route = input<Route | null>(null);

  readonly messengers = input<Messenger[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<RoutePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly estadoOptions: { label: string; value: RouteStatus }[] = [
    { label: 'Planificada', value: 'planificada' },
    { label: 'En curso', value: 'en_curso' },
    { label: 'Finalizada', value: 'finalizada' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    mensajero_id: [null as number | null, [Validators.required]],
    zona_cobertura: ['', [Validators.maxLength(100)]],
    estado: ['planificada' as RouteStatus, [Validators.required]],
    fecha: ['', [Validators.required]],
    hora_inicio: [''],
    hora_fin: [''],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.route();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        nombre: current?.nombre ?? '',
        mensajero_id: current?.mensajero_id ?? null,
        zona_cobertura: current?.zona_cobertura ?? '',
        estado: current?.estado ?? 'planificada',
        fecha: toDateInput(current?.fecha),
        hora_inicio: toTimeInput(current?.hora_inicio),
        hora_fin: toTimeInput(current?.hora_fin),
        is_active: current?.is_active ?? true,
      });

      // `is_active` solo cambia con PATCH /deactivate: al editar no se ofrece.
      if (current) {
        this.form.controls.is_active.disable();
      } else {
        this.form.controls.is_active.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: RoutePayload = {
      nombre: value.nombre.trim(),
      mensajero_id: Number(value.mensajero_id),
      zona_cobertura: value.zona_cobertura.trim() || null,
      estado: value.estado,
      fecha: value.fecha,
      hora_inicio: value.hora_inicio || null,
      hora_fin: value.hora_fin || null,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.route() ? payload : { ...payload, is_active: value.is_active });
  }
}
