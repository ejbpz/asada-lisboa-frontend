import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountApi } from './account-api';
import { environment } from '@environments/environment.development';

describe('AccountApi', () => {
  let service: AccountApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ]
    });

    service = TestBed.inject(AccountApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send forgot password request', () => {
    const request = {
      email: 'eduardo@test.com'
    };

    service.forgotPassword(request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ACCOUNT}/cuenta/olvidar-contrasena`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: request.email
    });

    req.flush(null);
  });

  it('should reset password', () => {
    const request = {
      email: 'eduardo@test.com',
      token: 'token-123',
      password: 'Password123*',
      confirmPassword: 'Password123*'
    };

    service.resetPassword(request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ACCOUNT}/cuenta/restaurar-contrasena`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: request.email,
      token: request.token,
      password: request.password,
      confirmPassword: request.confirmPassword
    });

    req.flush(null);
  });

  it('should confirm email', () => {
    const email = 'eduardo@test.com';
    const token = 'confirm-token';

    service.confirmEmail(email, token)
      .subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_ACCOUNT}/registrar/confirmar-correo`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.params.get('email')).toBe(email);
    expect(req.request.params.get('token')).toBe(token);
    expect(req.request.body).toBeNull();

    req.flush(null);
  });
});
