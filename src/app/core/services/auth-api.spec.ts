import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideZonelessChangeDetection } from "@angular/core";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { AuthApi } from "./auth-api";
import { StorageBrowser } from "./storage-browser";
import { environment } from "@environments/environment.development";

describe('AccountApi', () => {
  let service: AuthApi;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<StorageBrowser>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageBrowser', [
      'get',
      'set',
      'remove'
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),

        {
          provide: StorageBrowser,
          useValue: storageSpy
        }
      ]
    });

    service = TestBed.inject(AuthApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login user and store session', () => {
    const request = {
      email: 'test@test.com',
      password: '123456'
    };

    const response = {
      token: 'token',
      refreshToken: 'refresh-token',
      expirationToken: new Date('2030-01-01'),
      refreshTokenExpiration: new Date('2030-02-01')
    };

    service.loginUser(request)
      .subscribe(result => {
        expect(result).toBeTrue();
        expect(service.isAuthenticated()).toBeTrue();
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_ACCOUNT}/cuenta/iniciar-sesion`
    );
    expect(req.request.method).toBe('POST');

    req.flush(response);

    expect(storageSpy.set).toHaveBeenCalledWith(
      'token_key',
      response.token
    );
    expect(storageSpy.set).toHaveBeenCalledWith(
      'refresh_token_key',
      response.refreshToken
    );
  });

  it('should logout user and clear session', () => {
    service.logoutUser()
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ACCOUNT}/cuenta/cerrar-sesion`
    );

    expect(req.request.method).toBe('POST');

    req.flush(null);

    expect(storageSpy.remove).toHaveBeenCalledWith('token_key');
    expect(storageSpy.remove).toHaveBeenCalledWith('refresh_token_key');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should notify expired session', () => {
    service.notifySessionExpired();

    expect(service.sessionExpired()).toBeTrue();
    expect(service.isAuthenticated()).toBeFalse();
    expect(storageSpy.remove).toHaveBeenCalled();
  });

  it('should return true when token exists and is not expired', () => {
    storageSpy.get.and.callFake((key: string) => {
      if (key === 'token_key')
        return 'token';

      if (key === 'token_expiration_key')
        return '2030-01-01';

      return null;
    });

    expect(service.hasValidSession()).toBeTrue();
  });

  it('should expose auth state', () => {
    service.notifySessionExpired();

    expect(service.authState()).toEqual({
      isAuthenticated: false,
      sessionExpired: true
    });
  });
});
