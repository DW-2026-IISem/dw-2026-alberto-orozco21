import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { SessionTokens } from '../models/auth.model';
import { SessionStore } from '../services/session-store';
import { authGuard } from './auth-guard';
import { guestGuard } from './guest-guard';

const tokens: SessionTokens = {
  access_token: 'access-token',
  token_type: 'Bearer',
  expires_in: 900,
  refresh_token: 'refresh-token',
  refresh_expires_in: 86400,
};

describe('auth guards', () => {
  beforeEach(() => {
    localStorage.removeItem('enlace-express.session.v1');
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('redirects protected routes to login and preserves the requested URL', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/construir?section=envios' } as RouterStateSnapshot),
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).queryParams['returnUrl']).toBe('/construir?section=envios');
  });

  it('allows an authenticated user and redirects them away from login', () => {
    TestBed.inject(SessionStore).setTokens(tokens);
    const router = TestBed.inject(Router);

    const protectedResult = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, { url: '/construir' } as RouterStateSnapshot),
    );
    const guestResult = TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, { url: '/login' } as RouterStateSnapshot),
    );

    expect(protectedResult).toBe(true);
    expect(guestResult).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(guestResult as UrlTree)).toBe('/construir');
  });
});