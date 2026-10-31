import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Package, PackagePayload } from '../../../core/models/package.model';
import { Shipment } from '../../../core/models/shipment.model';
import { toNumberOrNull } from '../../../core/utils/form-values';

/**
 * Formulario de paquete, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `pack` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-package-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, TextareaModule, InputNumberModule, CheckboxModule, SelectModule],
  templateUrl: './package-form.html',
  styleUrl: './package-form.css',
})
export class PackageForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly pack = input<Package | null>(null);

  readonly shipments = input<Shipment[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<PackagePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    envio_id: [null as number | null, [Validators.required]],
    descripcion_contenido: ['', [Validators.maxLength(255)]],
    peso_kg: [null as number | null, [Validators.required, Validators.min(0)]],
    valor_declarado: [null as number | null, [Validators.min(0)]],
    alto_cm: [null as number | null, [Validators.min(0)]],
    ancho_cm: [null as number | null, [Validators.min(0)]],
    largo_cm: [null as number | null, [Validators.min(0)]],
    es_fragil: [false],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.pack();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        envio_id: current?.envio_id ?? null,
        descripcion_contenido: current?.descripcion_contenido ?? '',
        peso_kg: toNumberOrNull(current?.peso_kg),
        valor_declarado: toNumberOrNull(current?.valor_declarado),
        alto_cm: toNumberOrNull(current?.alto_cm),
        ancho_cm: toNumberOrNull(current?.ancho_cm),
        largo_cm: toNumberOrNull(current?.largo_cm),
        es_fragil: current?.es_fragil ?? false,
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
    const payload: PackagePayload = {
      envio_id: Number(value.envio_id),
      descripcion_contenido: value.descripcion_contenido.trim() || null,
      peso_kg: Number(value.peso_kg),
      valor_declarado: value.valor_declarado,
      alto_cm: value.alto_cm,
      ancho_cm: value.ancho_cm,
      largo_cm: value.largo_cm,
      es_fragil: value.es_fragil,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.pack() ? payload : { ...payload, is_active: value.is_active });
  }
}
