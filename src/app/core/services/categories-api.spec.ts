import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoriesApi } from './categories-api';
import { environment } from '@environments/environment';

describe('CategoriesApi', () => {
  let service: CategoriesApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CategoriesApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should search categories', () => {
    const query = 'agua';
    const mockResponse = [
      {
        id: '1',
        name: 'Agua'
      }
    ];

    service.searchCategories(query)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.length).toBe(1);
      });

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_ADMIN}/categorias/buscar`
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search'))
      .toBe(query);

    req.flush(mockResponse);
  });
});
