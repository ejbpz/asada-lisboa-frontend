import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { StatusesApi } from './statuses-api';
import { environment } from '@environments/environment.development';

describe('StatusesApi', () => {
  let service: StatusesApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        StatusesApi
      ]
    });

    service = TestBed.inject(StatusesApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call get statuses endpoint', () => {
    const mockResponse = [
      { id: '1', name: 'Active' }
    ];

    let result: any;

    service.getStatuses().subscribe(res => {
      result = res;
    });

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/estados`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });
});
