import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AppError } from '@core/interfaces/app-error.interface';

export const apiGlobalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 0) {
          const networkError: AppError = {
            status: 0,
            isNetworkError: true,
            message: 'Error de conexión',
          };

          return throwError(() => networkError);
        }

        // ProblemDetails (backend response)
        const problem = error.error;

        const appError: AppError = {
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
        };

        return throwError(() => appError);
      })
    );
};
