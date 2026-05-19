import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppError } from '@core/interfaces/app-error.interface';
import { apiGlobalErrorInterceptor } from './api-global-error-interceptor';

describe('apiGlobalErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiGlobalErrorInterceptor])),
        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function triggerError(status: number, errorBody: any = {}) {
    let result: AppError | undefined;

    http.get('/test').subscribe({
      error: (err) => {
        result = err;
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush(errorBody, { status, statusText: 'Error' });

    return result!;
  }

  it('should map 429 to rate limit error', () => {
    let error: AppError;

    http.get('/test').subscribe({
      error: (err) => (error = err)
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 429, statusText: 'Too Many Requests' });

    expect(error!.status).toBe(429);
    expect(error!.message).toBe('Muchas peticiones realizadas, espere un momento.');
  });

  it('should map 403 to forbidden error', () => {
    let error: AppError;

    http.get('/test').subscribe({
      error: (err) => (error = err)
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 403, statusText: 'Forbidden' });

    expect(error!.status).toBe(403);
    expect(error!.message).toBe('No posee permisos para realizar esta acción.');
  });

  it('should map 500+ to server error', () => {
    let error: AppError;

    http.get('/test').subscribe({
      error: (err) => (error = err)
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 500, statusText: 'Server Error' });

    expect(error!.status).toBe(500);
    expect(error!.message).toBe('Ocurrió un error interno del servidor.');
  });

  it('should map status 0 to network error', () => {
    let error: AppError;

    http.get('/test').subscribe({
      error: (err) => (error = err)
    });

    const req = httpMock.expectOne('/test');

    req.error(new ProgressEvent('Network error'), {
      status: 0,
      statusText: 'Unknown Error'
    });

    expect(error!.status).toBe(0);
    expect(error!.isNetworkError).toBeTrue();
    expect(error!.message).toBe('Error de conexión');
  });

  it('should map ProblemDetails response', () => {
    const problem = {
      title: 'Validation error',
      detail: 'Invalid request',
      type: 'https://example.com/validation',
      errors: [
        {
          code: 'field_required',
          description: 'field required'
        }
      ]
    };

    let error: AppError;

    http.get('/test').subscribe({
      error: (err) => (error = err)
    });

    const req = httpMock.expectOne('/test');
    req.flush(problem, { status: 400, statusText: 'Bad Request' });

    expect(error!.status).toBe(400);
    expect(error!.message).toBe('Invalid request');
    expect(error!.type).toBe(problem.type);
    expect(error!.errors).toEqual(problem.errors);
  });
});
