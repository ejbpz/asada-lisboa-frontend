import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthApi } from '@core/services/auth-api';
import { jwtTokenInterceptor } from './jwt-token-interceptor';
import { of, throwError } from 'rxjs';

describe('jwtTokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authApiMock: jasmine.SpyObj<AuthApi>;

  beforeEach(() => {
    authApiMock = jasmine.createSpyObj('AuthApi', [
      'hasSession',
      'getToken',
      'refreshToken',
      'clearSession'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApi, useValue: authApiMock },
        provideHttpClient(withInterceptors([jwtTokenInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function expectRequest(url: string) {
    return httpMock.expectOne(url);
  }

  it('should send only x-version when no session exists', () => {
    authApiMock.hasSession.and.returnValue(false);

    http.get('/public').subscribe();

    const req = httpMock.expectOne('/public');

    expect(req.request.headers.get('x-version')).toBe('1');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

  it('should add Authorization header for admin request', () => {
    authApiMock.hasSession.and.returnValue(true);
    authApiMock.getToken.and.returnValue('token-123');

    http.get('/admin/users').subscribe();

    const req = httpMock.expectOne('/admin/users');
    expect(req.request.headers.get('x-version')).toBe('1');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-123');

    req.flush({});
  });

  it('should attach token on logout request', () => {
    authApiMock.hasSession.and.returnValue(true);
    authApiMock.getToken.and.returnValue('token-xyz');

    http.post('/cuenta/cerrar-sesion', {}).subscribe();

    const req = httpMock.expectOne('/cuenta/cerrar-sesion');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-xyz');

    req.flush({});
  });

  it('should bypass interceptor for refresh request', () => {
    http.post('/cuenta/refrescar-token', {}).subscribe();

    const req = httpMock.expectOne('/cuenta/refrescar-token');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({});
  });

  it('should refresh token and retry request on 401', () => {
    authApiMock.hasSession.and.returnValue(true);
    authApiMock.getToken.and.returnValue('new-token');
    authApiMock.refreshToken.and.returnValue(of(true));

    http.get('/admin/data').subscribe();

    const firstReq = httpMock.expectOne('/admin/data');
    firstReq.flush({}, { status: 401, statusText: 'Unauthorized' });

    const retryReq = httpMock.expectOne('/admin/data');

    expect(retryReq.request.headers.get('Authorization'))
      .toBe('Bearer new-token');

    retryReq.flush({});
  });

  it('should clear session when refresh fails', () => {
    authApiMock.hasSession.and.returnValue(true);
    authApiMock.getToken.and.returnValue('old-token');

    authApiMock.refreshToken.and.returnValue(
      throwError(() => new Error('refresh failed'))
    );

    http.get('/admin/data').subscribe({
      error: () => {}
    });

    const req = httpMock.expectOne('/admin/data');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(authApiMock.clearSession).toHaveBeenCalled();
  });
});
