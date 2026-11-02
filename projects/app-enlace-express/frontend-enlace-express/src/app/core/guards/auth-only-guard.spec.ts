import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { SessionStore } from '../services/session-store';
import { authOnlyGuard } from './auth-only-guard';

describe('authOnlyGuard', () => {
  it('redirects to the dashboard when authentication is disabled', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: SessionStore, useValue: { authEnabled: false } },
      ],
    });

    const result = TestBed.runInInjectionContext(() => authOnlyGuard({} as never, {} as never));

    expect(result).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/dashboard');
  });

  it('allows the route when authentication is enabled', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: SessionStore, useValue: { authEnabled: true } },
      ],
    });

    expect(TestBed.runInInjectionContext(() => authOnlyGuard({} as never, {} as never))).toBe(true);
  });
});