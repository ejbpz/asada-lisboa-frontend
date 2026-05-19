import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AuthApi } from '@core/services/auth-api';
import { authenticatedUserGuard } from './authenticated-user-guard';

describe('authenticatedUserGuard', () => {
  let authApiMock: jasmine.SpyObj<AuthApi>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authApiMock = jasmine.createSpyObj('AuthApi', ['isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApi, useValue: authApiMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow navigation when user is authenticated', () => {
    authApiMock.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authenticatedUserGuard({} as any, {} as any)
    );

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    authApiMock.isAuthenticated.and.returnValue(false);

    const urlTreeMock = {} as any;
    routerMock.createUrlTree.and.returnValue(urlTreeMock);

    const result = TestBed.runInInjectionContext(() =>
      authenticatedUserGuard({} as any, {} as any)
    );

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/cuenta/iniciar-sesion']);
    expect(result).toBe(urlTreeMock);
  });
});
