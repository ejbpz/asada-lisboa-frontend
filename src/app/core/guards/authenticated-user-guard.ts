import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthApi } from '@core/services/auth-api';

export const authenticatedUserGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authApiService = inject(AuthApi);

  return authApiService.isAuthenticated()
    ? true
    : router.createUrlTree(['/cuenta/iniciar-sesion']);
};
