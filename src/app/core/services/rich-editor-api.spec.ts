import { TestBed } from '@angular/core/testing';
import { HttpEventType, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RichEditorApi } from './rich-editor-api';
import { environment } from '@environments/environment';

describe('RichEditorApi', () => {
  let service: RichEditorApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(RichEditorApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should upload image with progress events', () => {
    const file = new File(['dummy'], 'image.png', { type: 'image/png' });

    let receivedEvent: any;

    service.uploadTemporalImage(file)
      .subscribe(event => {
        receivedEvent = event;
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/editor/imagen-temp`
    );
    expect(req.request.method).toBe('POST');

    const formData = req.request.body as FormData;

    expect(formData.has('file')).toBeTrue();
    expect(req.request.reportProgress).toBeTrue();
    expect(req.request.responseType).toBe('json');

    req.event({
      type: HttpEventType.UploadProgress,
      loaded: 50,
      total: 100
    } as any);

    req.flush({} as any);

    expect(receivedEvent).toBeDefined();
  });
});
