import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppError } from '@core/interfaces/app-error.interface';

export const apiGlobalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 429) {
          return throwError(() => new AppError({
            name: '',
            status: 429,
            message:
              'Muchas peticiones realizadas, espere un momento.'
          }));
        }

        if(error.status === 403) {
          const forbiddenError = new AppError({
            name: '',
            status: 403,
            message: 'No posee permisos para realizar esta acción.'
          })

          return throwError(() => forbiddenError);
        }

        if(error.status === 401) {
          const authError = new AppError({
            name: '',
            status: 401,
            isAuthError: true,
            message: 'Usuario no autenticado.',
          })

          return throwError(() => authError);
        }

        if (error.status >= 500) {
          return throwError(() => new AppError({
            name: '',
            status: error.status,
            message:
              'Ocurrió un error interno del servidor.'
          }));
        }

        if(error.status === 0) {
          const networkError = new AppError({
            name: '',
            status: 0,
            isNetworkError: true,
            message: 'Error de conexión.',
          })

          return throwError(() => networkError);
        }

        // ProblemDetails (backend response)
        const problem = error.error;

        const appError = new AppError({
          name: '',
          message:
            problem?.detail ??
            problem?.title ??
            error.message ??
            'Error inesperado.',

          status: error.status,

          type: problem?.type,
          title: problem?.title,
          detail: problem?.detail,

          errors: Array.isArray(problem?.errors)
            ? problem.errors
            : undefined,

          isAuthError: error.status === 401
        })

        return throwError(() => appError);
      })
    );
};
