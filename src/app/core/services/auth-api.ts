import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, map, Observable, shareReplay, tap, throwError } from 'rxjs';
import { StorageBrowser } from './storage-browser';
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

  private isRefreshing = false;
  private refresh$: Observable<boolean> | null = null;

  // Injection
  private httpClient = inject(HttpClient);
  private storage = inject(StorageBrowser);

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

  public refreshToken(): Observable<boolean> {
    const token = this.getToken();
    const refreshToken = this.getRefreshToken();

    if(!token || !refreshToken)
      return throwError(() => new Error('Sin tokens para refrescar.'));

    if(this.isRefreshing && this.refresh$)
      return this.refresh$;

    this.isRefreshing = true;

    this.refresh$ = this.httpClient.post<LoginResponse>(`${this.env.API_URL_ACCOUNT}/cuenta/refrescar-token`, {
      token: token,
      refreshToken: refreshToken,
    }).pipe(
        map((response: LoginResponse) => this.setUser(response)),
        shareReplay(1),
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al refrescar token.'))),
        finalize(() => {
          this.isRefreshing = false;
          this.refresh$ = null;
        })
      );

    return this.refresh$;
  }

  // Getters
  public getToken(): string | null {
    return this.storage.get(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return this.storage.get(this.REFRESH_TOKEN_KEY);
  }

  private getTokenExpiration(): string | null {
    return this.storage.get(this.TOKEN_EXPIRATION_KEY);
  }

  private getRefreshTokenExpiration(): string | null {
    return this.storage.get(this.REFRESH_TOKEN_EXPIRATION_KEY);
  }

  // Functions
  private setUser(loginResponse: LoginResponse): boolean {
    this.storage.set(this.TOKEN_KEY, loginResponse.token);
    this.storage.set(this.REFRESH_TOKEN_KEY, loginResponse.refreshToken);
    this.storage.set(this.TOKEN_EXPIRATION_KEY, loginResponse.expirationToken.toString());
    this.storage.set(this.REFRESH_TOKEN_EXPIRATION_KEY, loginResponse.refreshTokenExpiration.toString());

    return true;
  }

  private removeUser(): void {
    this.storage.remove(this.TOKEN_KEY);
    this.storage.remove(this.REFRESH_TOKEN_KEY);
    this.storage.remove(this.TOKEN_EXPIRATION_KEY);
    this.storage.remove(this.REFRESH_TOKEN_EXPIRATION_KEY);
  }

  private isTokenExpired(): boolean {
    try {
      let TokenDateLS: string | null = this.getTokenExpiration();

      if(!TokenDateLS)
        return true;

      const tokenDate = new Date(TokenDateLS);
      const dateNow = new Date(Date.now());

      return (tokenDate < dateNow)
    } catch {
      return true;
    }
  }

  public isUserAuthenticated(): boolean {
    const token = this.getToken();

    if(!token) return false;

    return !this.isTokenExpired();
  }
}
