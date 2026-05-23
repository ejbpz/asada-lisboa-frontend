import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, HttpParams } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GalleryApi } from './gallery-api';
import { environment } from '@environments/environment';
import { ImageResponse } from '@admin/interfaces/image-response.interface';

describe('GalleryApi', () => {
  let service: GalleryApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(GalleryApi);

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get public images', () => {
    const params = new HttpParams()
      .set('take', '10');

    const mockResponse = {
      data: [],
      total: 0
    };

    service.getPublicImages(params)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_CLIENT}/imagenes`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('take'))
      .toBe('10');

    req.flush(mockResponse);
  });

  it('should get admin images', () => {
    const params = new HttpParams()
      .set('search', 'evento');

    const mockResponse = {
      data: [],
      total: 0
    };

    service.getAdminImages(params)
      .subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_ADMIN}/imagenes`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search'))
      .toBe('evento');

    req.flush(mockResponse);
  });

  it('should get admin image by id', () => {
    const id = '123';

    const mockResponse: ImageResponse = {
      id: id,
      publicationDate: new Date(),
      url: `/imagenes/imagen-${id}.jpeg`,
      slug: `imagen-${id}`,
      title: 'Imagen 123',
      filePath: `imagenes/imagen-${id}.jpeg`,
      fileName: `imagen-${id}.jpeg`,
      description: '',
      fileSize: 7874,
      statusId: '1',
      statusName: 'Publicado',
      categories: [],
    };

    service.getAdminImage(id)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/imagenes/${id}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should delete image', () => {
    const id = '123';

    service.deleteImage(id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/imagenes/${id}`
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should create image with form data', () => {
    const file = new File(
      ['image-content'],
      'image.png',
      { type: 'image/png' }
    );

    const request = {
      title: 'Imagen',
      statusId: 'status-1',
      description: 'Descripción',
      file,
      categories: [
        {
          id: 'cat-1',
          name: 'Eventos'
        }
      ]
    };

    service.createOrEditImage(request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/imagenes`
    );
    expect(req.request.method).toBe('POST');

    const body = req.request.body as FormData;

    expect(body.get('title'))
      .toBe(request.title);
    expect(body.get('statusId'))
      .toBe(request.statusId);
    expect(body.get('description'))
      .toBe(request.description);
    expect(body.get('file'))
      .toBe(file);
    expect(body.get('categories[0].id'))
      .toBe('cat-1');
    expect(body.get('categories[0].name'))
      .toBe('Eventos');

    req.flush({});
  });

  it('should edit image', () => {
    const id = '123';

    const request = {
      title: 'Imagen editada',
      statusId: 'status-1',
      description: 'Nueva descripción',
      file: undefined,
      categories: []
    };

    service.createOrEditImage(request, id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/imagenes/${id}`
    );
    expect(req.request.method).toBe('PUT');

    const body = req.request.body as FormData;

    expect(body.get('title'))
      .toBe(request.title);
    expect(body.get('statusId'))
      .toBe(request.statusId);
    expect(body.get('description'))
      .toBe(request.description);
    expect(body.get('file'))
      .toBeNull();

    req.flush({});
  });
});
