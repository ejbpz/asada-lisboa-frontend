import { TestBed } from "@angular/core/testing";
import { provideZonelessChangeDetection } from "@angular/core";
import { HttpParams, provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { DocumentsApi } from "./documents-api";
import { environment } from "@environments/environment.development";
import { DocumentRequest } from "@admin/interfaces/document-request.interface";
import { DocumentResponse } from "@admin/interfaces/document-response.interface";

describe('DocumentsApi', () => {
  let service: DocumentsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
      ]
    });

    service = TestBed.inject(DocumentsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get public documents', () => {
    const params = new HttpParams()
      .set('take', '10');

    const mockResponse = {
      data: [],
      total: 0
    };

    service.getPublicDocuments(params)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_CLIENT}/documentos`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('take'))
      .toBe('10');

    req.flush(mockResponse);
  });

  it('should get admin documents', () => {
    const params = new HttpParams()
      .set('search', 'agua');

    const mockResponse = {
      data: [],
      count: 0
    };

    service.getAdminDocuments(params)
      .subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_ADMIN}/documentos`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('search'))
      .toBe('agua');

    req.flush(mockResponse);
  });

  it('should get admin document by id', () => {
    const id = '123';
    const date = new Date();

    const mockResponse: DocumentResponse = {
      id: id,
      statusId: '1',
      fileSize: '5451',
      title: 'Documento',
      slug: `documento-${id}`,
      documentTypeName: 'pdf',
      statusName: 'Publicado',
      fileName: 'Documento 123',
      filePath: `/documento-${id}.pdf`,
      description: '',
      categories: [],
      publicationdate: date,
    };

    service.getAdminDocument(id)
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/documentos/${id}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should delete document', () => {
    const id = '123';

    service.deleteDocument(id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/documentos/${id}`
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should create document with form data', () => {
    const file = new File(
      ['test'],
      'test.pdf',
      { type: 'application/pdf' }
    );

    const request = {
      title: 'Documento',
      file,
      statusId: 'status-1',
      description: 'Descripción',
      categories: [
        {
          id: 'cat-1',
          name: 'Categoría'
        }
      ]
    };

    service.createOrEditDocument(request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/documentos`
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
      .toBe('Categoría');

    req.flush({});
  });

  it('should edit document', () => {
    const id = '123';

    const request: DocumentRequest = {
      file: undefined,
      title: 'Documento',
      statusId: 'status-1',
      description: 'Descripción',
      categories: [],
    };

    service.createOrEditDocument(request, id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/documentos/${id}`
    );
    expect(req.request.method).toBe('PUT');

    const body = req.request.body as FormData;

    expect(body.get('title'))
      .toBe(request.title);
    expect(body.get('statusId'))
      .toBe(request.statusId);

    req.flush({});
  });
});
