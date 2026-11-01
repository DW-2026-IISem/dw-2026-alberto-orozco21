import { TestBed } from '@angular/core/testing';
import { TrackingEventForm } from './tracking-event-form';

const VALUES = {
  "envio_id": 1,
  "fecha": "2026-01-01T10:30:00.000Z"
};
const RECORD = { id: 1, is_active: true, ...VALUES };

describe('TrackingEventForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TrackingEventForm] }).compileComponents();
  });

  async function createForm(record: Record<string, unknown> | null = null) {
    const fixture = TestBed.createComponent(TrackingEventForm);
    if (record) fixture.componentRef.setInput('trackingEvent', record);
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
    form.form.patchValue({ ubicacion: 'Borrador' } as never);
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();
    expect(form.form.get('ubicacion')?.value).toBe('');
  });
});
