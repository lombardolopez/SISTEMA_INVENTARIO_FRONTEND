import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../models/user.model';

export const roleGuard = (...allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    if (user && allowedRoles.includes(user.role)) {
      return true;
    }
    return inject(Router).createUrlTree(['/dashboard']);
  };
};
