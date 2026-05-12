import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { ResetPasswordRequest } from '@account/interfaces/reset-password-request.interface';
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
    });
  }

  public resetPassword(resetPasswordRequest: ResetPasswordRequest): Observable<void> {
    return this.httpClient.post<void>(`${this.env.API_URL_ACCOUNT}/cuenta/restaurar-contrasena`, {
      email: resetPasswordRequest.email,
      token: resetPasswordRequest.token,
      password: resetPasswordRequest.password,
      confirmPassword: resetPasswordRequest.confirmPassword,
    });
  }

  public confirmEmail(email: string, token: string): Observable<void> {
    const params = new HttpParams()
      .set('email', email)
      .set('token', token)

    return this.httpClient.post<void>(`${this.env.API_URL_ACCOUNT}/registrar/confirmar-correo`, null, { params: params });
  }
}
