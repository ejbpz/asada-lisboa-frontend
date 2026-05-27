import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchApi } from './search-api';
import { environment } from '@environments/environment';
import { SearchResponse } from '@public/interfaces/search-response.interface';

describe('SearchApi', () => {
  let service: SearchApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchApi,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SearchApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call GET /buscador with query param', () => {
    const mockResponse: SearchResponse[] = [
      {
        id: '1',
        type: 'noticia',
        slug: 'resultado-1',
        title: 'Resultado 1',
        url: '/noticia/resultado-1',
        description: 'Descripción del resultado 1.',
      } as SearchResponse,
    ];

    const query = 'agua';

    service.searchPublicData(query).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.API_URL_CLIENT}/buscador?query=${query}`
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should send query param correctly', () => {
    const query = 'factura';

    service.searchPublicData(query).subscribe();

    const req = httpMock.expectOne((request) => {
      return (
        request.url === `${environment.API_URL_CLIENT}/buscador` &&
        request.params.get('query') === query
      );
    });

    expect(req.request.method).toBe('GET');

    req.flush([]);
  });
});
