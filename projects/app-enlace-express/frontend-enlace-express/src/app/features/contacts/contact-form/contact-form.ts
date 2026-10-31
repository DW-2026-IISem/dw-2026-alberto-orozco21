import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Company } from '../../../core/models/company.model';
import { Contact, ContactPayload } from '../../../core/models/contact.model';

@Component({
  host: { class: 'block' },
  selector: 'app-contact-form',
  imports: [MessageModule, ReactiveFormsModule, ButtonModule, InputTextModule, CheckboxModule, SelectModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  readonly contact = input<Contact | null>(null);
  readonly companies = input<Company[]>([]);
  readonly resetKey = input(0);
  readonly saving = input(false);
  readonly saved = output<ContactPayload>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);
  readonly activeOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  readonly form = this.fb.group({
    empresa_id: [null as number | null, [Validators.required]],
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    cargo: ['', [Validators.maxLength(100)]],
    telefono: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.maxLength(150)]],
    is_principal: [false],
    is_active: [true],
  });

  constructor() {
    effect(() => {
      const current = this.contact();
      this.resetKey();
      this.form.reset({
        empresa_id: current?.empresa_id ?? null,
        nombre: current?.nombre ?? '',
        cargo: current?.cargo ?? '',
        telefono: current?.telefono ?? '',
        email: current?.email ?? '',
        is_principal: current?.is_principal ?? false,
        is_active: current?.is_active ?? true,
      });
      if (current) this.form.controls.is_active.disable();
      else this.form.controls.is_active.enable();
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const payload: ContactPayload = {
      empresa_id: Number(value.empresa_id),
      nombre: value.nombre.trim(),
      cargo: value.cargo.trim() || null,
      telefono: value.telefono.trim() || null,
      email: value.email.trim() || null,
      is_principal: value.is_principal,
    };
    this.saved.emit(this.contact() ? payload : { ...payload, is_active: value.is_active });
  }
}
