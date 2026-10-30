import { TestBed } from '@angular/core/testing';
import { ShipmentList } from './shipment-list';

describe('ShipmentList', () => {
  it('should render a logistics empty state without calling the API', async () => {
    await TestBed.configureTestingModule({ imports: [ShipmentList] }).compileComponents();
    const fixture = TestBed.createComponent(ShipmentList);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Envíos');
    expect(compiled.textContent).toContain('El listado de envíos se implementará en ISS-03');
  });
});