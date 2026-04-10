import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { LoginRequest } from '@account/interfaces/login-request.interface';
import { LoginResponse } from '@account/interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  // Init
  private env = environment;
  private TOKEN_KEY = 'token_key';
  private REFRESH_TOKEN_KEY = 'refresh_token_key';
  private TOKEN_EXPIRATION_KEY = 'token_expiration_key';
  private REFRESH_TOKEN_EXPIRATION_KEY = 'refresh_token_expiration_key';

  // Injection
  private httpClient = inject(HttpClient);

  // HTTP calls
  public loginUser(loginRequest: LoginRequest): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(`${this.env.API_URL_ACCOUNT}/cuenta/iniciar-sesion`, {
      email: loginRequest.email,
      password: loginRequest.password
    }).pipe(
        map((response: LoginResponse) => this.setUser(response)),
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al iniciar sesión.')))
      );
  }

  public logoutUser(): Observable<void> {
    return this.httpClient.post<void>(`${this.env.API_URL_ACCOUNT}/cuenta/cerrar-sesion`, {})
      .pipe(
        tap(() => this.removeUser())
      );
  }

  // Functions
  private setUser(loginResponse: LoginResponse): boolean {
    localStorage.setItem(this.TOKEN_KEY, loginResponse.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, loginResponse.refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRATION_KEY, loginResponse.expirationToken.toString());
    localStorage.setItem(this.REFRESH_TOKEN_EXPIRATION_KEY, loginResponse.refreshTokenExpiration.toString());

    return true;
  }

  private removeUser(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_EXPIRATION_KEY);
  }
}
