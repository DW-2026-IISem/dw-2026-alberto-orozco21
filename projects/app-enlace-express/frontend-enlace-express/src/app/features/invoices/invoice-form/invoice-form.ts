import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Invoice, InvoicePayload, InvoiceStatus } from '../../../core/models/invoice.model';
import { Company } from '../../../core/models/company.model';
import { toDateInput, toNumberOrNull } from '../../../core/utils/form-values';

/**
 * Formulario de factura, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `invoice` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-invoice-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule],
  templateUrl: './invoice-form.html',
  styleUrl: './invoice-form.css',
})
export class InvoiceForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly invoice = input<Invoice | null>(null);

  readonly companies = input<Company[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<InvoicePayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly estadoOptions: { label: string; value: InvoiceStatus }[] = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Pagada', value: 'pagada' },
    { label: 'Vencida', value: 'vencida' },
    { label: 'Anulada', value: 'anulada' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    numero: ['', [Validators.required, Validators.maxLength(40)]],
    empresa_id: [null as number | null, [Validators.required]],
    periodo_desde: ['', [Validators.required]],
    periodo_hasta: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    estado: ['pendiente' as InvoiceStatus, [Validators.required]],
    subtotal: [null as number | null, [Validators.required, Validators.min(0)]],
    impuestos: [null as number | null, [Validators.min(0)]],
    total: [null as number | null, [Validators.required, Validators.min(0)]],
    fecha_pago: [''],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.invoice();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        numero: current?.numero ?? '',
        empresa_id: current?.empresa_id ?? null,
        periodo_desde: toDateInput(current?.periodo_desde),
        periodo_hasta: toDateInput(current?.periodo_hasta),
        fecha: toDateInput(current?.fecha),
        estado: current?.estado ?? 'pendiente',
        subtotal: toNumberOrNull(current?.subtotal),
        impuestos: toNumberOrNull(current?.impuestos),
        total: toNumberOrNull(current?.total),
        fecha_pago: toDateInput(current?.fecha_pago),
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
    const payload: InvoicePayload = {
      numero: value.numero.trim(),
      empresa_id: Number(value.empresa_id),
      periodo_desde: value.periodo_desde,
      periodo_hasta: value.periodo_hasta,
      fecha: value.fecha,
      estado: value.estado,
      subtotal: Number(value.subtotal),
      impuestos: value.impuestos,
      total: Number(value.total),
      fecha_pago: value.fecha_pago || null,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.invoice() ? payload : { ...payload, is_active: value.is_active });
  }
}
