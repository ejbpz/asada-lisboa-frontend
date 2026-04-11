import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { ForgotPasswordRequest } from '@account/interfaces/forgot-password-request.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountApi {
    // Init
  private env = environment;

  // Injection
  private httpClient = inject(HttpClient);

  // HTTP calls
  public forgotPassword(forgotPasswordRequest: ForgotPasswordRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.env.API_URL_ACCOUNT}/cuenta/olvidar-contrasena`, {
      email: forgotPasswordRequest.email
    }).pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al enviar email.')))
      );
  }
}
