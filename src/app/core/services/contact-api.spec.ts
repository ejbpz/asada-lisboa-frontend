import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactApi } from './contact-api';
import { environment } from '@environments/environment';
import { ContactResponse } from '@public/interfaces/contact-response.interface';

describe('ContactApi', () => {
  let service: ContactApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ContactApi);

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get contact information', () => {
    const mockResponse = {
      data: [
        {
          id: '1',
          value: '8888-8888',
          order: 1
        }
      ]
    };

    service.getContactInformation()
      .subscribe(response => {
        expect(response).toEqual(mockResponse.data as ContactResponse[]);
        expect(response.length).toBe(1);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_CLIENT}/contactos`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should send contact email', () => {
    const request = {
      email: 'test@test.com',
      subject: 'Consulta',
      message: 'Hola',
      fullName: 'Eduardo',
      phoneNumber: '88888888'
    };

    service.contactEmail(request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ACCOUNT}/email`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(null);
  });

  it('should validate recaptcha', () => {
    const token = 'captcha-token';

    service.recaptchaValidation(token)
      .subscribe(response => {
        expect(response).toBeTrue();
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_ACCOUNT}/email/re-captcha`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      reCaptchaRequest: token
    });

    req.flush(true);
  });

  it('should get admin contacts', () => {
    const mockResponse = {
      data: []
    };

    service.getAdminContacts()
      .subscribe();

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_ADMIN}/contactos`
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('take'))
      .toBe('100');
    expect(req.request.params.get('sortBy'))
      .toBe('order');
    expect(req.request.params.get('sortDirection'))
      .toBe('asc');

    req.flush(mockResponse);
  });

  it('should create contact', () => {
    const request = {
      order: 1,
      value: '8888-8888',
      contactType: 'phone'
    };

    service.createOrEditContact(request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/contactos`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush({});
  });

  it('should edit contact', () => {
    const request = {
      order: 1,
      value: '8888-8888',
      contactType: 'phone'
    };

    const id = '123';

    service.createOrEditContact(request, id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/contactos/${id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);

    req.flush({});
  });

  it('should delete contact', () => {
    const id = '123';

    service.deleteContact(id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/contactos/${id}`
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
