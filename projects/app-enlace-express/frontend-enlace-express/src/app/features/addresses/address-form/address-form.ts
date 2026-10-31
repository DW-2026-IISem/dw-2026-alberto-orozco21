import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Address, AddressPayload, AddressType } from '../../../core/models/address.model';
import { Company } from '../../../core/models/company.model';
import { toNumberOrNull } from '../../../core/utils/form-values';

/**
 * Formulario de dirección, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `address` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-address-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule],
  templateUrl: './address-form.html',
  styleUrl: './address-form.css',
})
export class AddressForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly address = input<Address | null>(null);

  readonly companies = input<Company[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<AddressPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly tipoOptions: { label: string; value: AddressType }[] = [
    { label: 'Recogida', value: 'recogida' },
    { label: 'Entrega', value: 'entrega' },
    { label: 'Mixta', value: 'mixta' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    empresa_id: [null as number | null, [Validators.required]],
    tipo: ['recogida' as AddressType, [Validators.required]],
    alias: ['', [Validators.required, Validators.maxLength(80)]],
    linea1: ['', [Validators.required, Validators.maxLength(200)]],
    linea2: ['', [Validators.maxLength(200)]],
    ciudad: ['', [Validators.required, Validators.maxLength(100)]],
    departamento: ['', [Validators.maxLength(100)]],
    pais: ['', [Validators.maxLength(100)]],
    codigo_postal: ['', [Validators.maxLength(20)]],
    latitud: [null as number | null, [Validators.min(-90), Validators.max(90)]],
    longitud: [null as number | null, [Validators.min(-180), Validators.max(180)]],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.address();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        empresa_id: current?.empresa_id ?? null,
        tipo: current?.tipo ?? 'recogida',
        alias: current?.alias ?? '',
        linea1: current?.linea1 ?? '',
        linea2: current?.linea2 ?? '',
        ciudad: current?.ciudad ?? '',
        departamento: current?.departamento ?? '',
        pais: current?.pais ?? '',
        codigo_postal: current?.codigo_postal ?? '',
        latitud: toNumberOrNull(current?.latitud),
        longitud: toNumberOrNull(current?.longitud),
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
    const payload: AddressPayload = {
      empresa_id: Number(value.empresa_id),
      tipo: value.tipo,
      alias: value.alias.trim(),
      linea1: value.linea1.trim(),
      linea2: value.linea2.trim() || null,
      ciudad: value.ciudad.trim(),
      departamento: value.departamento.trim() || null,
      pais: value.pais.trim() || null,
      codigo_postal: value.codigo_postal.trim() || null,
      latitud: value.latitud,
      longitud: value.longitud,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.address() ? payload : { ...payload, is_active: value.is_active });
  }
}
