import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Shell } from './shell';

describe('Shell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [provideRouter([]), MessageService, ConfirmationService],
    }).compileComponents();
  });

  it('should compose the application regions and notification hosts', async () => {
    const fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('aside app-aside')).toBeTruthy();
    expect(compiled.querySelector('main#contenido router-outlet')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
    expect(compiled.querySelector('p-toast')).toBeTruthy();
    expect(compiled.querySelector('p-confirmdialog')).toBeTruthy();
  });

  it('should open the mobile drawer from the header button', async () => {
    const fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector(
      'app-header button[aria-label="Mostrar u ocultar el menú"]',
    ) as HTMLButtonElement;

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.mobileOpen()).toBe(true);
  });
});