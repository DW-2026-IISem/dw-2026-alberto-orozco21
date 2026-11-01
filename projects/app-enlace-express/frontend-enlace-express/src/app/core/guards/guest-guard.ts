import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

export const guestGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  if (!session.authEnabled || !session.isAuthenticated()) {
    return true;
  }
  return inject(Router).createUrlTree(['/construir']);
};