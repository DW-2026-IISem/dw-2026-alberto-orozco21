import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DeliveryProof, DeliveryProofPayload, DeliveryProofStatus } from '../../../core/models/delivery-proof.model';
import { Shipment } from '../../../core/models/shipment.model';
import { toDateTimeInput, toNumberOrNull } from '../../../core/utils/form-values';

/**
 * Formulario de comprobante de entrega, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `deliveryProof` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-delivery-proof-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, InputNumberModule, SelectModule],
  templateUrl: './delivery-proof-form.html',
  styleUrl: './delivery-proof-form.css',
})
export class DeliveryProofForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly deliveryProof = input<DeliveryProof | null>(null);

  readonly shipments = input<Shipment[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<DeliveryProofPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly estadoOptions: { label: string; value: DeliveryProofStatus }[] = [
    { label: 'Válida', value: 'valida' },
    { label: 'Observada', value: 'observada' },
    { label: 'Rechazada', value: 'rechazada' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    envio_id: [null as number | null, [Validators.required]],
    fecha_hora: ['', [Validators.required]],
    receptor_nombre: ['', [Validators.required, Validators.maxLength(120)]],
    receptor_documento: ['', [Validators.maxLength(30)]],
    estado: ['valida' as DeliveryProofStatus, [Validators.required]],
    firma_url: ['', [Validators.maxLength(255)]],
    foto_url: ['', [Validators.maxLength(255)]],
    geolocalizacion_lat: [null as number | null, [Validators.min(-90), Validators.max(90)]],
    geolocalizacion_lng: [null as number | null, [Validators.min(-180), Validators.max(180)]],
    observaciones: ['', [Validators.maxLength(500)]],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.deliveryProof();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        envio_id: current?.envio_id ?? null,
        fecha_hora: toDateTimeInput(current?.fecha_hora),
        receptor_nombre: current?.receptor_nombre ?? '',
        receptor_documento: current?.receptor_documento ?? '',
        estado: current?.estado ?? 'valida',
        firma_url: current?.firma_url ?? '',
        foto_url: current?.foto_url ?? '',
        geolocalizacion_lat: toNumberOrNull(current?.geolocalizacion_lat),
        geolocalizacion_lng: toNumberOrNull(current?.geolocalizacion_lng),
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
    const payload: DeliveryProofPayload = {
      envio_id: Number(value.envio_id),
      fecha_hora: new Date(value.fecha_hora).toISOString(),
      receptor_nombre: value.receptor_nombre.trim(),
      receptor_documento: value.receptor_documento.trim() || null,
      estado: value.estado,
      firma_url: value.firma_url.trim() || null,
      foto_url: value.foto_url.trim() || null,
      geolocalizacion_lat: value.geolocalizacion_lat,
      geolocalizacion_lng: value.geolocalizacion_lng,
      observaciones: value.observaciones.trim() || null,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.deliveryProof() ? payload : { ...payload, is_active: value.is_active });
  }
}
