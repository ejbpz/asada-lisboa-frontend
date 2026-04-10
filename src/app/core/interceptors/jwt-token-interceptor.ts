import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { AuthApi } from '@core/services/auth-api';

export const jwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authApiService = inject(AuthApi);

  const isAuthRequest = req.url.includes('/admin/');
  const isLogoutRequest = req.url.includes('/cuenta/cerrar-sesion');
  const isAuthUser = authApiService.isUserAuthenticated();

  const newHeaders: Record<string, string> = {
    'x-version': '1'
  };

  if(isAuthUser && (isAuthRequest || isLogoutRequest)) {
    const token = authApiService.getToken();
    newHeaders['Authorization'] = `Bearer ${token}`;
  }

  const newReq = req.clone({ setHeaders: newHeaders });
  return next(newReq);
};
