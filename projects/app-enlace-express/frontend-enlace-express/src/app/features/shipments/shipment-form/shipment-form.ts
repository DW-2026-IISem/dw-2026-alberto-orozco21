import { Component, computed, effect, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Shipment, ShipmentPayload, ShipmentPriority, ShipmentStatus } from '../../../core/models/shipment.model';
import { Company } from '../../../core/models/company.model';
import { Contact } from '../../../core/models/contact.model';
import { Address } from '../../../core/models/address.model';
import { Messenger } from '../../../core/models/messenger.model';
import { Route } from '../../../core/models/route.model';
import { Rate } from '../../../core/models/rate.model';
import { Invoice } from '../../../core/models/invoice.model';
import { fromDateTimeInput, toDateTimeInput, toNumberOrNull } from '../../../core/utils/form-values';

/**
 * Formulario de envío, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `shipment` (o `null` para crear) y emite el payload con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-shipment-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, SelectModule],
  templateUrl: './shipment-form.html',
  styleUrl: './shipment-form.css',
})
export class ShipmentForm {
  /** Registro a editar. `null` deja el formulario en modo creación. */
  readonly shipment = input<Shipment | null>(null);

  readonly companies = input<Company[]>([]);
  readonly contacts = input<Contact[]>([]);
  readonly addresses = input<Address[]>([]);
  readonly messengers = input<Messenger[]>([]);
  readonly routes = input<Route[]>([]);
  readonly rates = input<Rate[]>([]);
  readonly invoices = input<Invoice[]>([]);

  /** Cambia cada vez que el padre abre el diálogo: reinicia el formulario. */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<ShipmentPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly prioridadOptions: { label: string; value: ShipmentPriority }[] = [
    { label: 'Normal', value: 'normal' },
    { label: 'Urgente', value: 'urgente' },
    { label: 'Express', value: 'express' },
  ];

  readonly estadoOptions: { label: string; value: ShipmentStatus }[] = [
    { label: 'Creado', value: 'creado' },
    { label: 'Cotizado', value: 'cotizado' },
    { label: 'Asignado', value: 'asignado' },
    { label: 'En ruta', value: 'en_ruta' },
    { label: 'Entregado', value: 'entregado' },
    { label: 'Con novedad', value: 'con_novedad' },
    { label: 'Cancelado', value: 'cancelado' },
  ];

  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    numero_guia: ['', [Validators.required, Validators.maxLength(40)]],
    empresa_id: [null as number | null, [Validators.required]],
    prioridad: ['normal' as ShipmentPriority, [Validators.required]],
    estado: ['creado' as ShipmentStatus, [Validators.required]],
    contacto_origen_id: [null as number | null, [Validators.required]],
    direccion_origen_id: [null as number | null, [Validators.required]],
    contacto_destino_id: [null as number | null, [Validators.required]],
    direccion_destino_id: [null as number | null, [Validators.required]],
    tarifa_id: [null as number | null, [Validators.required]],
    mensajero_id: [null as number | null],
    ruta_id: [null as number | null],
    factura_id: [null as number | null],
    peso_total_kg: [null as number | null, [Validators.required, Validators.min(0)]],
    valor_declarado: [null as number | null, [Validators.min(0)]],
    costo_calculado: [null as number | null, [Validators.min(0)]],
    fecha_solicitud: ['', [Validators.required]],
    fecha_entrega_estimada: [''],
    fecha_entrega_real: [''],
    is_active: [true],
  });

  /** Empresa elegida en el formulario: filtra los contactos y direcciones de origen. */
  private readonly empresaId = toSignal(this.form.controls.empresa_id.valueChanges, {
    initialValue: null as number | null,
  });

  readonly originContacts = computed(() => {
    const id = this.empresaId();
    return id === null ? [] : this.contacts().filter((contact) => contact.empresa_id === id);
  });

  readonly originAddresses = computed(() => {
    const id = this.empresaId();
    return id === null ? [] : this.addresses().filter((address) => address.empresa_id === id);
  });

  constructor() {
    effect(() => {
      const current = this.shipment();
      // `resetKey` se lee a propósito: abrir de nuevo el diálogo debe vaciar el formulario.
      this.resetKey();

      this.form.reset({
        numero_guia: current?.numero_guia ?? '',
        empresa_id: current?.empresa_id ?? null,
        prioridad: current?.prioridad ?? 'normal',
        estado: current?.estado ?? 'creado',
        contacto_origen_id: current?.contacto_origen_id ?? null,
        direccion_origen_id: current?.direccion_origen_id ?? null,
        contacto_destino_id: current?.contacto_destino_id ?? null,
        direccion_destino_id: current?.direccion_destino_id ?? null,
        tarifa_id: current?.tarifa_id ?? null,
        mensajero_id: current?.mensajero_id ?? null,
        ruta_id: current?.ruta_id ?? null,
        factura_id: current?.factura_id ?? null,
        peso_total_kg: toNumberOrNull(current?.peso_total_kg),
        valor_declarado: toNumberOrNull(current?.valor_declarado),
        costo_calculado: toNumberOrNull(current?.costo_calculado),
        fecha_solicitud: toDateTimeInput(current?.fecha_solicitud),
        fecha_entrega_estimada: toDateTimeInput(current?.fecha_entrega_estimada),
        fecha_entrega_real: toDateTimeInput(current?.fecha_entrega_real),
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
    const payload: ShipmentPayload = {
      numero_guia: value.numero_guia.trim(),
      empresa_id: Number(value.empresa_id),
      prioridad: value.prioridad,
      estado: value.estado,
      contacto_origen_id: Number(value.contacto_origen_id),
      direccion_origen_id: Number(value.direccion_origen_id),
      contacto_destino_id: Number(value.contacto_destino_id),
      direccion_destino_id: Number(value.direccion_destino_id),
      tarifa_id: Number(value.tarifa_id),
      mensajero_id: value.mensajero_id,
      ruta_id: value.ruta_id,
      factura_id: value.factura_id,
      peso_total_kg: Number(value.peso_total_kg),
      valor_declarado: value.valor_declarado,
      costo_calculado: value.costo_calculado,
      fecha_solicitud: new Date(value.fecha_solicitud).toISOString(),
      fecha_entrega_estimada: fromDateTimeInput(value.fecha_entrega_estimada),
      fecha_entrega_real: fromDateTimeInput(value.fecha_entrega_real),
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.shipment() ? payload : { ...payload, is_active: value.is_active });
  }
}
