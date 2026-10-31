import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Address } from '../../../core/models/address.model';
import { Company, CompanyPayload } from '../../../core/models/company.model';
import { Contact } from '../../../core/models/contact.model';

@Component({
  host: { class: 'block' },
  selector: 'app-company-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule],
  templateUrl: './company-form.html',
  styleUrl: './company-form.css',
})
export class CompanyForm {
  readonly company = input<Company | null>(null);
  readonly contacts = input<Contact[]>([]);
  readonly addresses = input<Address[]>([]);
  readonly resetKey = input(0);
  readonly saving = input(false);
  readonly saved = output<CompanyPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);
  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  readonly form = this.fb.group({
    nit: ['', [Validators.required, Validators.maxLength(30)]],
    razon_social: ['', [Validators.required, Validators.maxLength(150)]],
    contacto_principal_id: [null as number | null],
    direccion_facturacion_id: [null as number | null],
    is_active: [true],
  });

  readonly contactOptions = computed(() => {
    const current = this.company();
    return current ? this.contacts().filter((contact) => contact.empresa_id === current.id) : [];
  });
  readonly addressOptions = computed(() => {
    const current = this.company();
    return current ? this.addresses().filter((address) => address.empresa_id === current.id) : [];
  });

  constructor() {
    effect(() => {
      const current = this.company();
      this.resetKey();
      this.form.reset({
        nit: current?.nit ?? '',
        razon_social: current?.razon_social ?? '',
        contacto_principal_id: current?.contacto_principal_id ?? null,
        direccion_facturacion_id: current?.direccion_facturacion_id ?? null,
        is_active: current?.is_active ?? true,
      });
      if (current) {
        this.form.controls.is_active.disable();
        this.form.controls.contacto_principal_id.enable();
        this.form.controls.direccion_facturacion_id.enable();
      } else {
        this.form.controls.is_active.enable();
        this.form.controls.contacto_principal_id.disable();
        this.form.controls.direccion_facturacion_id.disable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const payload: CompanyPayload = {
      nit: value.nit.trim(),
      razon_social: value.razon_social.trim(),
    };
    const current = this.company();
    this.saved.emit(
      current
        ? { ...payload, contacto_principal_id: value.contacto_principal_id, direccion_facturacion_id: value.direccion_facturacion_id }
        : { ...payload, is_active: value.is_active },
    );
  }
}
