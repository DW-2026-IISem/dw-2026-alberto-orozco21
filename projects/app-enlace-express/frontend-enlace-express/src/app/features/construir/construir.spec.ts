import { TestBed } from '@angular/core/testing';
import { Construir } from './construir';

function stubDesktopMedia(matches: boolean): () => void {
  const original = window.matchMedia;

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) =>
      ({
        matches,
        media: query,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList,
  });

  return () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: original,
    });
  };
}

describe('Construir', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Construir] }).compileComponents();
  });

  async function createScreen() {
    const fixture = TestBed.createComponent(Construir);
    await fixture.whenStable();
    return { fixture, compiled: fixture.nativeElement as HTMLElement };
  }

  function menuButton(compiled: HTMLElement): HTMLButtonElement {
    const button = compiled.querySelector(
      'app-header button[aria-label="Mostrar u ocultar el menú"]',
    );
    expect(button).toBeTruthy();
    return button as HTMLButtonElement;
  }

  function menuOption(compiled: HTMLElement, label: string): HTMLElement {
    const option = [...compiled.querySelectorAll('a, button, [role="button"]')].find(
      (element) => element.textContent?.trim() === label,
    );
    expect(option).toBeTruthy();
    return option as HTMLElement;
  }

  it('should compose the layout and start on Inicio', async () => {
    const { compiled } = await createScreen();

    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('aside app-aside')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
    expect(compiled.querySelector('main h1')?.textContent).toContain('Inicio');
  });

  it('should render all backend entity options in their menu groups', async () => {
    const { fixture, compiled } = await createScreen();

    for (const label of ['Inicio', 'Operación', 'Administración']) {
      expect(compiled.textContent).toContain(label);
    }

    menuOption(compiled, 'Operación').click();
    fixture.detectChanges();
    await fixture.whenStable();
    for (const label of [
      'Empresas',
      'Contactos',
      'Direcciones',
      'Mensajeros',
      'Tarifas',
      'Rutas',
      'Envíos',
      'Paquetes',
      'Eventos de seguimiento',
      'Comprobantes de entrega',
      'Facturas',
    ]) {
      expect(compiled.textContent).toContain(label);
    }

    menuOption(compiled, 'Administración').click();
    fixture.detectChanges();
    await fixture.whenStable();
    for (const label of [
      'Usuarios',
      'Roles',
      'Recursos',
      'Asignaciones de rol',
      'Concesiones de recursos',
      'Sesiones',
    ]) {
      expect(compiled.textContent).toContain(label);
    }
  });

  it('should always show the menu button', async () => {
    const { compiled } = await createScreen();
    expect(menuButton(compiled).classList.contains('lg:hidden')).toBe(false);
  });

  it('should change the title without navigating when an option is chosen', async () => {
    const { fixture, compiled } = await createScreen();
    const pathname = window.location.pathname;

    menuOption(compiled, 'Operación').click();
    fixture.detectChanges();
    await fixture.whenStable();
    menuOption(compiled, 'Empresas').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.querySelector('main h1')?.textContent).toContain('Empresas');
    expect(window.location.pathname).toBe(pathname);
  });

  it('should open the mobile drawer when the header requests it', async () => {
    const { fixture, compiled } = await createScreen();
    const component = fixture.componentInstance;

    expect(component.mobileOpen()).toBe(false);
    menuButton(compiled).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.mobileOpen()).toBe(true);
  });

  it('should hide the fixed aside on desktop instead of opening the drawer', async () => {
    const restore = stubDesktopMedia(true);

    try {
      const { fixture, compiled } = await createScreen();
      expect(compiled.querySelector('aside app-aside')).toBeTruthy();

      menuButton(compiled).click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.sidebarCollapsed()).toBe(true);
      expect(compiled.querySelector('aside')).toBeNull();
      expect(fixture.componentInstance.mobileOpen()).toBe(false);
    } finally {
      restore();
    }
  });

  it('should close the drawer after choosing an option', async () => {
    const { fixture, compiled } = await createScreen();
    const component = fixture.componentInstance;

    menuButton(compiled).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.mobileOpen()).toBe(true);

    menuOption(compiled, 'Operación').click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.mobileOpen()).toBe(true);

    menuOption(compiled, 'Envíos').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.mobileOpen()).toBe(false);
    expect(compiled.querySelector('main h1')?.textContent).toContain('Envíos');
  });
});