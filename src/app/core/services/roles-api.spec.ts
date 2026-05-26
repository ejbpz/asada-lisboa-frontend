import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RolesApi } from './roles-api';
import { environment } from '@environments/environment';

describe('RolesApi', () => {
  let service: RolesApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(RolesApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call getRoles and return roles list', () => {
    const mockResponse = [
      { id: '1', name: 'Admin' },
      { id: '2', name: 'User' }
    ] as any;

    let result: any;

    service.getRoles().subscribe(res => {
      result = res;
    });

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/roles`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });
});
