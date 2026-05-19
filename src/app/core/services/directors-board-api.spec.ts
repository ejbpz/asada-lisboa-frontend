import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, HttpParams } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DirectorsBoardApi } from './directors-board-api';
import { environment } from '@environments/environment.development';
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { DirectorBoardDetailsResponse } from '@admin/interfaces/director-board-details-response.interface';

describe('DirectorsBoardApi', () => {
  let service: DirectorsBoardApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(DirectorsBoardApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get directors board information', () => {
    const mockResponse = [
      {
        id: '1',
        name: 'Eduardo',
        charge: 'Presidente',
      }
    ];

    service.getDirectorsBoardInformation()
      .subscribe(response => {
        expect(response).toEqual(mockResponse as DirectorsBoardResponse[]);
        expect(response.length).toBe(1);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_CLIENT}/usuarios`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get admin users', () => {
    const params = new HttpParams()
      .set('take', '10')
      .set('offset', '0');

    const mockResponse = {
      data: [],
      total: 0
    };

    service.getAdminUsers(params)
      .subscribe(response => {
        expect(response).toEqual(mockResponse as PageResponse<DirectorsBoardResponse>);
      });

    const req = httpMock.expectOne(request =>
      request.url === `${environment.API_URL_ADMIN}/usuarios`
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('take'))
      .toBe('10');
    expect(req.request.params.get('offset'))
      .toBe('0');

    req.flush(mockResponse);
  });

  it('should get admin user by id', () => {
    const id = '123';

    const mockResponse = {
      id: id,
      roles: [],
      chargeId: '1',
      name: 'Eduardo',
      phoneNumber: null,
      charge: 'Presidente',
      firstName: 'Eduardo',
      firstLastName: 'Brenes',
      secondLastName: 'Pérez',
      email: 'test@email.com',
    };

    service.getAdminUser(id)
      .subscribe(response => {
        expect(response).toEqual(mockResponse as DirectorBoardDetailsResponse);
      });

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/usuarios/${id}`
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should delete user', () => {
    const id = '123';

    service.deleteUser(id)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/usuarios/${id}`
    );
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should create user', () => {
    const request = {
      email: 'test@test.com',
      roleId: 'role-1',
      chargeId: 'charge-1',
      password: 'Password123*',
      confirmPassword: 'Password123*',
      firstName: 'Eduardo',
      phoneNumber: '88888888',
      firstLastName: 'Brenes',
      secondLastName: 'Test'
    };

    service.createUser(request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ACCOUNT}/registrar`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush(null);
  });

  it('should update user', () => {
    const id = '123';

    const request = {
      roleId: 'role-1',
      chargeId: 'charge-1',
      firstName: 'Eduardo',
      phoneNumber: '88888888',
      firstLastName: 'Brenes',
      secondLastName: 'Test'
    };

    service.updateUser(id, request)
      .subscribe();

    const req = httpMock.expectOne(
      `${environment.API_URL_ADMIN}/usuarios/${id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(request);

    req.flush(null);
  });
});
