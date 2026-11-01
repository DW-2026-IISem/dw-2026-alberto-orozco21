import { TestBed } from '@angular/core/testing';
import { CompanyForm } from './company-form';

const VALUES = {
  "nit": "900111222",
  "razon_social": "Nueva SAS"
};
const RECORD = { id: 1, is_active: true, ...VALUES };

describe('CompanyForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CompanyForm] }).compileComponents();
  });

  async function createForm(record: Record<string, unknown> | null = null) {
    const fixture = TestBed.createComponent(CompanyForm);
    if (record) fixture.componentRef.setInput('company', record);
    await fixture.whenStable();
    const emitted: unknown[] = [];
    fixture.componentInstance.saved.subscribe((payload) => emitted.push(payload));
    return { fixture, form: fixture.componentInstance, emitted };
  }

  it('does not emit while required fields are empty', async () => {
    const { form, emitted } = await createForm();
    form.submit();
    expect(form.form.invalid).toBe(true);
    expect(emitted).toEqual([]);
  });

  it('emits a valid create payload with is_active', async () => {
    const { form, emitted } = await createForm();
    form.form.patchValue(VALUES as never);
    form.submit();
    expect(emitted).toHaveLength(1);
    expect((emitted[0] as Record<string, unknown>)['is_active']).toBe(true);
  });

  it('loads an existing record and omits is_active when editing', async () => {
    const { form, emitted } = await createForm(RECORD);
    expect(form.form.controls['is_active'].disabled).toBe(true);
    form.submit();
    expect(emitted).toHaveLength(1);
    expect('is_active' in (emitted[0] as Record<string, unknown>)).toBe(false);
  });

  it('clears the form when resetKey changes', async () => {
    const { fixture, form } = await createForm();
    form.form.patchValue({ razon_social: 'Borrador' } as never);
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();
    expect(form.form.get('razon_social')?.value).toBe('');
  });
});
