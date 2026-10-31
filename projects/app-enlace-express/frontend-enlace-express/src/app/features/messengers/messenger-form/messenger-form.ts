import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Messenger, MessengerPayload, VehicleType } from '../../../core/models/messenger.model';

/**
 * Formulario de mensajero, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `messenger` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-messenger-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './messenger-form.html',
  styleUrl: './messenger-form.css',
})
export class MessengerForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly messenger = input<Messenger | null>(null);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<MessengerPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly tipoVehiculoOptions: { label: string; value: VehicleType }[] = [
    { label: 'Moto', value: 'moto' },
    { label: 'Carro', value: 'carro' },
    { label: 'Bicicleta', value: 'bicicleta' },
    { label: 'A pie', value: 'a_pie' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    documento_identidad: ['', [Validators.required, Validators.maxLength(30)]],
    telefono: ['', [Validators.maxLength(30)]],
    tipo_vehiculo: ['moto' as VehicleType, [Validators.required]],
    placa_vehiculo: ['', [Validators.maxLength(15)]],
    zona_asignada: ['', [Validators.maxLength(100)]],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.messenger();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        nombre: current?.nombre ?? '',
        documento_identidad: current?.documento_identidad ?? '',
        telefono: current?.telefono ?? '',
        tipo_vehiculo: current?.tipo_vehiculo ?? 'moto',
        placa_vehiculo: current?.placa_vehiculo ?? '',
        zona_asignada: current?.zona_asignada ?? '',
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
    const payload: MessengerPayload = {
      nombre: value.nombre.trim(),
      documento_identidad: value.documento_identidad.trim(),
      telefono: value.telefono.trim() || null,
      tipo_vehiculo: value.tipo_vehiculo,
      placa_vehiculo: value.placa_vehiculo.trim() || null,
      zona_asignada: value.zona_asignada.trim() || null,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.messenger() ? payload : { ...payload, is_active: value.is_active });
  }
}
