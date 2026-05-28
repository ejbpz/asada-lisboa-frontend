import { inject } from '@angular/core';
import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApi } from '@core/services/auth-api';

export const jwtTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authApiService = inject(AuthApi);

  const isAuthRequest = req.url.includes('/registrar');
  const isAdminRequest = req.url.includes('/admin/');
  const isLogoutRequest = req.url.includes('/cuenta/cerrar-sesion');const isRefreshRequest = req.url.includes('/cuenta/refrescar-token');

  if(isRefreshRequest) {
    return next(req);
  }

  const hasSession = authApiService.hasSession();

  const newHeaders: Record<string, string> = {
    'x-version': '1'
  };

  if(!hasSession || (!isAdminRequest && !isLogoutRequest && !isAuthRequest)) {
    const versionReq = req.clone({ setHeaders: newHeaders });
    return next(versionReq);
  }

  const token = authApiService.getToken();
  newHeaders['Authorization'] = `Bearer ${token}`;

  if(isLogoutRequest || isAuthRequest) {
    const versionReq = req.clone({ setHeaders: newHeaders });
    return next(versionReq);
  }

  const newReq = req.clone({ setHeaders: newHeaders });
  return next(newReq)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status !== 401)
          return throwError(() => error);

        return authApiService.refreshToken()
          .pipe(
            switchMap((_: boolean) => {
              const retryReq = req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${authApiService.getToken()}`
                )
              });

              return next(retryReq);
            }),
            catchError((refreshError: HttpErrorResponse) => {
              authApiService.clearSession();
              return throwError(() => refreshError);
            })
          )
      })
    );
};
