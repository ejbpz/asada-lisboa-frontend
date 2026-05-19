import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AboutUsApi } from './about-us-api';
import { environment } from '@environments/environment.development';

describe('AboutUsApi', () => {
  let service: AboutUsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ]
    });

    service = TestBed.inject(AboutUsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get about us information', () => {
    const mockResponse = {
      data: [
        {
          id: '1',
          content: 'Historia',
          order: 1,
          sectionType: 'history'
        }
      ]
    };

    service.getAboutUsInformation().subscribe(response => {
        expect(response.length).toBe(1);

        expect(response).toEqual(mockResponse.data);
      });

      const req = httpMock.expectOne(
        `${environment.API_URL_CLIENT}/nosotros`
      );

      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
  });

  it('should get admin about us with params', () => {
    const mockResponse = {
      data: []
    };

    service.getAdminAboutUs().subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_ADMIN}/nosotros`
    );

    expect(req.request.method).toBe('GET');

    expect(req.request.params.get('take')).toBe('100');
    expect(req.request.params.get('offset')).toBe('0');
    expect(req.request.params.get('sortBy')).toBe('order');
    expect(req.request.params.get('sortDirection')).toBe('asc');

    req.flush(mockResponse);
  });

  it('should create about us section', () => {
    const request = {
      order: 1,
      content: 'Historia',
      sectionType: 'history'
    };

    service.createOrEditAboutUs(request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/nosotros`
    );

    expect(req.request.method).toBe('POST');

    expect(req.request.body).toEqual(request);

    req.flush({});
  });

  it('should edit about us section', () => {
    const request = {
      order: 1,
      content: 'Historia',
      sectionType: 'history'
    };

    const id = '123';

    service.createOrEditAboutUs(request, id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/nosotros/${id}`
    );

    expect(req.request.method).toBe('PUT');

    expect(req.request.body).toEqual(request);

    req.flush({});
  });

  it('should delete about us section', () => {
    const id = '123';

    service.deleteAboutUs(id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/nosotros/${id}`
    );

    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
