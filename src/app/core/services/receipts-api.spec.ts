import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReceiptsApi } from './receipts-api';
import { environment } from '@environments/environment';

describe('ReceiptsApi', () => {
  let service: ReceiptsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(ReceiptsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call getReceipt with correct URL', () => {
    const receiptNumber = 123;

    service.getReceipt(receiptNumber).subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_CLIENT}/recibos/${receiptNumber}`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush({});
  });

  it('should call getReceiptDetails with correct payload', () => {
    const request = {
      receiptNumber: 999,
      index: 2
    };

    service.getReceiptDetails(request).subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_CLIENT}/recibos`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      receiptNumber: 999,
      index: 2
    });

    req.flush({});
  });
});
