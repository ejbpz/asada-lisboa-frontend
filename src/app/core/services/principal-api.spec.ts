import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PrincipalApi } from './principal-api';
import { environment } from '@environments/environment';
import { PrincipalRequest } from '@public/interfaces/principal-response.interface';

describe('PrincipalApi', () => {
  let service: PrincipalApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ]
    });

    service = TestBed.inject(PrincipalApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get principal information', () => {
    const newId = '87';
    const imageId = '12';
    const documentId = '858';

    const mockResponse: PrincipalRequest = {
      news:[
        {
          id: newId,
          slug: `noticia-admin-${newId}`,
          title: 'Noticia admin 123',
          description: '',
          fileName: `noticia-admin-${newId}.png`,
          filePath: `noticias/noticia-admin-${newId}.png`,
          imageUrl: `/noticias/noticia-admin-${newId}.png`,
          statusId: '1',
          lastEditionDate: new Date(),
          categories: [],
        }
      ],
      images: [
        {
          id: imageId,
          statusId: '1',
          url: `/imagenes/imagen-${imageId}.jpeg`,
          slug: `imagen-${imageId}`,
          title: 'Imagen 123',
          fileName: `imagen-${imageId}.jpeg`,
          filePath: `imagenes/imagen-${imageId}.jpeg`,
          description: '',
          categories: [],
        }
      ],
      documents:[
        {
          id: documentId,
          statusId: '1',
          url: `/documentos/documento-${documentId}.pdf`,
          slug: `documento-${documentId}`,
          title: 'Documento',
          fileName: 'Documento 123',
          filePath: `documentos/documento-${documentId}.pdf`,
          description: '',
          categories: [],
          documentTypeName: 'pdf',
        }
      ],
    };

    service.getPrincipalInformation()
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_CLIENT}/principal`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});
