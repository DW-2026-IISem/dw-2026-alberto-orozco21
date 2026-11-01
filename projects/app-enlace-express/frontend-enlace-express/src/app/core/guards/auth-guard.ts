import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionStore);
  if (!session.authEnabled || session.isAuthenticated()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};