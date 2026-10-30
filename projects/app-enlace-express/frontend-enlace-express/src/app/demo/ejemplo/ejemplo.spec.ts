import { TestBed } from '@angular/core/testing';
import { Ejemplo } from './ejemplo';

describe('Ejemplo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Ejemplo] }).compileComponents();
  });

  it('should render the initial product and IVA', async () => {
    const fixture = TestBed.createComponent(Ejemplo);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Café molido 500 g');
    expect(compiled.textContent).toContain('18000');
    expect(compiled.textContent).toContain('21420');
    expect(compiled.textContent).toContain('Activo');
  });

  it('should update the price and its derived IVA', async () => {
    const fixture = TestBed.createComponent(Ejemplo);
    await fixture.whenStable();
    const increaseButton = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
    ).find((button) => button.textContent?.includes('+1000'));

    increaseButton?.click();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('19000');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('22610');
  });

  it('should update the product name from the input', async () => {
    const fixture = TestBed.createComponent(Ejemplo);
    await fixture.whenStable();
    const input = (fixture.nativeElement as HTMLElement).querySelector('input');
    if (!input) throw new Error('Product name input was not rendered');

    input.value = 'Café especial';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Café especial');
  });

  it('should toggle the active state and restore the initial product', async () => {
    const fixture = TestBed.createComponent(Ejemplo);
    await fixture.whenStable();
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    buttons[2].click();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Inactivo');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Producto inactivo');

    buttons[3].click();
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Activo');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('18000');
  });
});