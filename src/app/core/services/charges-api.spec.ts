import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChargesApi } from './charges-api';
import { environment } from '@environments/environment';

describe('ChargesApi', () => {
  let service: ChargesApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ]
    });

    service = TestBed.inject(ChargesApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get charges', () => {
    const mockResponse = [
      {
        id: '1',
        name: 'Presidente'
      },
      {
        id: '2',
        name: 'Secretario'
      }
    ];

    service.getCharges()
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.length).toBe(2);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/cargos`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
