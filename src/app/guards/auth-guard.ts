import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { Role } from '../classes/user';

// Only logged-in users can enter
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

// Only users with one of the roles can enter. Example: roleGuard('owner', 'inventory_manager')
export const roleGuard = (...roles: Role[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }
    if (authService.hasRole(...roles)) {
      return true;
    }
    router.navigate(['/home']);
    return false;
  };
};
