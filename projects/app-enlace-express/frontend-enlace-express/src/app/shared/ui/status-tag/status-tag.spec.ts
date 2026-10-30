import { TestBed } from '@angular/core/testing';
import { StatusTag } from './status-tag';

describe('StatusTag', () => {
  it('should update label and severity when is_active changes', async () => {
    const fixture = TestBed.createComponent(StatusTag);
    fixture.componentRef.setInput('isActive', true);
    await fixture.whenStable();
    expect(fixture.componentInstance.label()).toBe('Activo');
    expect(fixture.componentInstance.severity()).toBe('success');

    fixture.componentRef.setInput('isActive', false);
    await fixture.whenStable();
    expect(fixture.componentInstance.label()).toBe('Inactivo');
    expect(fixture.componentInstance.severity()).toBe('danger');
  });
});