import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TrackingEvent, TrackingEventPayload, TrackingEventStatus, TrackingEventType } from '../../../core/models/tracking-event.model';
import { Shipment } from '../../../core/models/shipment.model';
import { Messenger } from '../../../core/models/messenger.model';
import { toDateTimeInput } from '../../../core/utils/form-values';

/**
 * Formulario de evento de seguimiento, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `trackingEvent` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-tracking-event-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, SelectModule],
  templateUrl: './tracking-event-form.html',
  styleUrl: './tracking-event-form.css',
})
export class TrackingEventForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly trackingEvent = input<TrackingEvent | null>(null);

  readonly shipments = input<Shipment[]>([]);
  readonly messengers = input<Messenger[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<TrackingEventPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly tipoOptions: { label: string; value: TrackingEventType }[] = [
    { label: 'Recogido', value: 'recogido' },
    { label: 'En tránsito', value: 'en_transito' },
    { label: 'En reparto', value: 'en_reparto' },
    { label: 'Novedad', value: 'novedad' },
    { label: 'Entregado', value: 'entregado' },
    { label: 'Devuelto', value: 'devuelto' },
  ];

  readonly estadoOptions: { label: string; value: TrackingEventStatus }[] = [
    { label: 'Informativo', value: 'informativo' },
    { label: 'Novedad leve', value: 'novedad_leve' },
    { label: 'Novedad crítica', value: 'novedad_critica' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    envio_id: [null as number | null, [Validators.required]],
    tipo: ['recogido' as TrackingEventType, [Validators.required]],
    estado: ['informativo' as TrackingEventStatus, [Validators.required]],
    fecha: ['', [Validators.required]],
    ubicacion: ['', [Validators.maxLength(200)]],
    registrado_por_id: [null as number | null],
    observaciones: ['', [Validators.maxLength(500)]],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.trackingEvent();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        envio_id: current?.envio_id ?? null,
        tipo: current?.tipo ?? 'recogido',
        estado: current?.estado ?? 'informativo',
        fecha: toDateTimeInput(current?.fecha),
        ubicacion: current?.ubicacion ?? '',
        registrado_por_id: current?.registrado_por_id ?? null,
        observaciones: current?.observaciones ?? '',
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
    const payload: TrackingEventPayload = {
      envio_id: Number(value.envio_id),
      tipo: value.tipo,
      estado: value.estado,
      fecha: new Date(value.fecha).toISOString(),
      ubicacion: value.ubicacion.trim() || null,
      registrado_por_id: value.registrado_por_id,
      observaciones: value.observaciones.trim() || null,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.trackingEvent() ? payload : { ...payload, is_active: value.is_active });
  }
}
