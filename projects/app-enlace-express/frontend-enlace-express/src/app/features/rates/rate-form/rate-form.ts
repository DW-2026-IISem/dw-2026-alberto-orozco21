import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Rate, RatePayload, CalculationRule } from '../../../core/models/rate.model';

import { toDateInput, toNumberOrNull } from '../../../core/utils/form-values';

/**
 * Formulario de tarifa, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `rate` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-rate-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule],
  templateUrl: './rate-form.html',
  styleUrl: './rate-form.css',
})
export class RateForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly rate = input<Rate | null>(null);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<RatePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly reglaCalculoOptions: { label: string; value: CalculationRule }[] = [
    { label: 'Por peso', value: 'por_peso' },
    { label: 'Por zona', value: 'por_zona' },
    { label: 'Plana', value: 'plana' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    zona: ['', [Validators.required, Validators.maxLength(100)]],
    regla_calculo: ['por_peso' as CalculationRule, [Validators.required]],
    valor_base: [null as number | null, [Validators.required, Validators.min(0)]],
    valor_por_kg_adicional: [null as number | null, [Validators.min(0)]],
    recargo_urgente_pct: [null as number | null, [Validators.min(0), Validators.max(100)]],
    vigencia_desde: ['', [Validators.required]],
    vigencia_hasta: [''],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.rate();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        nombre: current?.nombre ?? '',
        zona: current?.zona ?? '',
        regla_calculo: current?.regla_calculo ?? 'por_peso',
        valor_base: toNumberOrNull(current?.valor_base),
        valor_por_kg_adicional: toNumberOrNull(current?.valor_por_kg_adicional),
        recargo_urgente_pct: toNumberOrNull(current?.recargo_urgente_pct),
        vigencia_desde: toDateInput(current?.vigencia_desde),
        vigencia_hasta: toDateInput(current?.vigencia_hasta),
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
    const payload: RatePayload = {
      nombre: value.nombre.trim(),
      zona: value.zona.trim(),
      regla_calculo: value.regla_calculo,
      valor_base: Number(value.valor_base),
      valor_por_kg_adicional: value.valor_por_kg_adicional,
      recargo_urgente_pct: value.recargo_urgente_pct,
      vigencia_desde: value.vigencia_desde,
      vigencia_hasta: value.vigencia_hasta || null,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.rate() ? payload : { ...payload, is_active: value.is_active });
  }
}
