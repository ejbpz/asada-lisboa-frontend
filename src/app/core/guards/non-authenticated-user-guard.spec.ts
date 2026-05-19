import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AuthApi } from '@core/services/auth-api';
import { nonAuthenticatedUserGuard } from './non-authenticated-user-guard';

describe('nonAuthenticatedUserGuard', () => {
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

  it('should redirect to /admin when user is authenticated', () => {
    authApiMock.isAuthenticated.and.returnValue(true);

    const urlTreeMock = {} as any;
    routerMock.createUrlTree.and.returnValue(urlTreeMock);

    const result = TestBed.runInInjectionContext(() =>
      nonAuthenticatedUserGuard({} as any, {} as any)
    );

    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/admin']);
    expect(result).toBe(urlTreeMock);
  });

  it('should allow navigation when user is not authenticated', () => {
    authApiMock.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      nonAuthenticatedUserGuard({} as any, {} as any)
    );

    expect(result).toBeTrue();
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });
});
