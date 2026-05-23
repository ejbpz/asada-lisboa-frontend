import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NewsApi } from './news-api';
import { environment } from '@environments/environment';
import { NewResponse } from '@shared/interfaces/new-response.interface';

describe('NewsApi', () => {
  let service: NewsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ]
    });

    service = TestBed.inject(NewsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get public news', () => {
    const params = new HttpParams()
      .set('take', '10');

    const mockResponse = {
      data: [],
      total: 0
    };

    service.getPublicNews(params)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_CLIENT}/noticias`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('take'))
      .toBe('10');

    req.flush(mockResponse);
  });

  it('should get public new by slug', () => {
    const slug = 'noticia-importante';

    const mockResponse: NewResponse = {
      id: '123',
      slug: slug,
      title: 'Noticia admin 123',
      description: '',
      fileName: `${slug}`,
      filePath: `noticias/${slug}`,
      imageUrl: `/noticias/${slug}`,
      statusId: '1',
      statusName: 'Publicado',
      lastEditionDate: new Date(),
      publicationDate: new Date(),
      categories: [],
    };

    service.getPublicNew(slug)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_CLIENT}/noticias/${slug}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get recommended news', () => {
    const slug = 'noticia-importante';

    const mockResponse = [
      {
        id: '123',
        slug: slug,
        title: 'Noticia admin 123',
        description: '',
        fileName: `${slug}`,
        filePath: `noticias/${slug}`,
        imageUrl: `/noticias/${slug}`,
        statusId: '1',
        statusName: 'Publicado',
        lastEditionDate: new Date(),
        publicationDate: new Date(),
        categories: [],
      }
    ];

    service.getRecommendedNews(slug)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.length).toBe(1);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_CLIENT}/noticias/recomendaciones/${slug}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get admin news', () => {
    const params = new HttpParams()
      .set('search', 'agua');

    const mockResponse = {
      data: [],
      total: 0
    };

    service.getAdminNews(params)
      .subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_ADMIN}/noticias`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search'))
      .toBe('agua');

    req.flush(mockResponse);
  });

  it('should get admin new by id', () => {
    const id = '123';

    const mockResponse: NewResponse = {
      id: id,
      slug: 'noticia-admin-123',
      title: 'Noticia admin 123',
      description: '',
      fileName: 'noticia-admin-123.jpg',
      filePath: 'noticias/noticia-admin-123.jpg',
      imageUrl: '/noticias/noticia-admin-123.jpg',
      statusId: '1',
      statusName: 'Publicado',
      lastEditionDate: new Date(),
      publicationDate: new Date(),
      categories: [],
    };

    service.getAdminNew(id)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/noticias/${id}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should create new with form data', () => {
    const file = new File(
      ['image-content'],
      'news.png',
      { type: 'image/png' }
    );

    const request = {
      title: 'Nueva noticia',
      statusId: 'status-1',
      description: 'Descripción noticia',
      file,
      categories: [
        {
          id: 'cat-1',
          name: 'Eventos'
        }
      ]
    };

    service.createOrEditNew(request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/noticias`
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

  it('should edit new', () => {
    const id = '123';

    const request = {
      title: 'Noticia editada',
      statusId: 'status-1',
      description: 'Nueva descripción',
      file: undefined,
      categories: []
    };

    service.createOrEditNew(request, id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/noticias/${id}`
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

  it('should delete new', () => {
    const id = '123';

    service.deleteNew(id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/noticias/${id}`
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
