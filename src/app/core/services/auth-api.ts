import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, map, Observable, shareReplay, throwError } from 'rxjs';
import { StorageBrowser } from './storage-browser';
import { AppError } from '../interfaces/app-error.interface';
import { environment } from '@environments/environment';
import { LoginRequest } from '@account/interfaces/login-request.interface';
import { LoginResponse } from '@account/interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  // Init
  private env = environment;

  private readonly TOKEN_KEY = 'token_key';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token_key';
  private readonly TOKEN_EXPIRATION_KEY = 'token_expiration_key';
  private readonly REFRESH_TOKEN_EXPIRATION_KEY = 'refresh_token_expiration_key';

  private isRefreshing = false;
  private refresh$: Observable<boolean> | null = null;


  private _isAuthenticated = signal<boolean>(false);
  public isAuthenticated = this._isAuthenticated.asReadonly();
  private _sessionExpired = signal<boolean>(false);
  public sessionExpired = this._sessionExpired.asReadonly();

  // Injections
  private httpClient = inject(HttpClient);
  private storage = inject(StorageBrowser);

  // Constructor
  constructor() {
    queueMicrotask(() => {

      this._isAuthenticated.set(
        this.hasValidSession()
      );

    });
  }

  public loginUser(loginRequest: LoginRequest): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(
      `${this.env.API_URL_ACCOUNT}/cuenta/iniciar-sesion`,
      {
        email: loginRequest.email,
        password: loginRequest.password
      }
    ).pipe(
      map(response => this.setUser(response))
    );
  }

  public logoutUser(): Observable<void> {
    return this.httpClient.post<void>(
      `${this.env.API_URL_ACCOUNT}/cuenta/cerrar-sesion`,
      {}
    ).pipe(
      finalize(() => this.clearSession())
    );
  }

  public refreshToken(): Observable<boolean> {
    const token = this.getToken();

    const refreshToken = this.getRefreshToken();

    if (!token || !refreshToken) {
      const appError: AppError = {
        isAuthError: true,
        message:
          'No hay sesión activa.'
      };

      return throwError(() => appError);
    }

    if (this.isRefreshing && this.refresh$) {
      return this.refresh$;
    }

    this.isRefreshing = true;

    this.refresh$ = this.httpClient.post<LoginResponse>(`${this.env.API_URL_ACCOUNT}/cuenta/refrescar-token`, {
      token,
      refreshToken
    }).pipe(
        map(response => this.setUser(response)),
        shareReplay(1),
        finalize(() => {
          this.isRefreshing = false;
          this.refresh$ = null;
        })
      );

    return this.refresh$;
  }

  private setUser(loginResponse: LoginResponse): boolean {
    this.storage.set(this.TOKEN_KEY, loginResponse.token);
    this.storage.set(this.REFRESH_TOKEN_KEY, loginResponse.refreshToken);
    this.storage.set(this.TOKEN_EXPIRATION_KEY, loginResponse.expirationToken.toString());
    this.storage.set(this.REFRESH_TOKEN_EXPIRATION_KEY, loginResponse.refreshTokenExpiration.toString());

    this._isAuthenticated.set(true);
    this._sessionExpired.set(false);

    return true;
  }

  public clearSession(): void {
    this.storage.remove(this.TOKEN_KEY);
    this.storage.remove(this.REFRESH_TOKEN_KEY);
    this.storage.remove(this.TOKEN_EXPIRATION_KEY);
    this.storage.remove(this.REFRESH_TOKEN_EXPIRATION_KEY);

    this._isAuthenticated.set(false);
  }

  public notifySessionExpired(): void {
    this._sessionExpired.set(true);

    this.clearSession();
  }

  public getToken(): string | null {
    return this.storage.get(this.TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return this.storage.get(this.REFRESH_TOKEN_KEY);
  }

  private getTokenExpiration(): string | null {
    return this.storage.get(this.TOKEN_EXPIRATION_KEY);
  }

  private isTokenExpired(): boolean {
    try {
      const tokenDateLS =
        this.getTokenExpiration();

      if (!tokenDateLS)
        return true;

      const tokenDate =
        new Date(tokenDateLS);

      return tokenDate < new Date();

    } catch {

      return true;
    }
  }

  public hasValidSession(): boolean {
    const token = this.getToken();

    if (!token)
      return false;

    return !this.isTokenExpired();
  }

  public hasSession(): boolean {
    return !!this.getRefreshToken();
  }

  public authState = computed(() => ({
    isAuthenticated: this.isAuthenticated(),
    sessionExpired: this.sessionExpired()
  }));
}
