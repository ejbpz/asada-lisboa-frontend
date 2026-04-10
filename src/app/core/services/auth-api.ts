import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@environments/environment.development';
import { LoginRequest } from '@account/interfaces/login-request.interface';
import { LoginResponse } from '@account/interfaces/login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private httpClient = inject(HttpClient);
  private env = environment;

  public loginUser(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${this.env.API_URL_ACCOUNT}/cuenta/iniciar-sesion`, {
      email: loginRequest.email,
      password: loginRequest.password
    });
  }
}
