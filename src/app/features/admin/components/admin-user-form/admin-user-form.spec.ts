import { Router } from '@angular/router';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminUserForm } from './admin-user-form';
import { RolesApi } from '@core/services/roles-api';
import { ChargesApi } from '@core/services/charges-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { DirectorsBoardApi } from '@core/services/directors-board-api';
import { RoleResponse } from '@admin/interfaces/role-response.interface';
import { ChargeResponse } from '@admin/interfaces/charge-response.interface';
import { RegisterRequest } from '@admin/interfaces/register-request.interface';

describe('AdminUserForm', () => {
  let component: AdminUserForm;
  let fixture: ComponentFixture<AdminUserForm>;

  let router: jasmine.SpyObj<Router>;
  let rolesApi: jasmine.SpyObj<RolesApi>;
  let chargesApi: jasmine.SpyObj<ChargesApi>;
  let toast: jasmine.SpyObj<ToastMessage>;
  let directorsBoardApi: jasmine.SpyObj<DirectorsBoardApi>;

  const mockRoles: RoleResponse[] = [
    {
      id: 'role-1',
      name: 'admin'
    }
  ];

  const mockCharges: ChargeResponse[] = [
    {
      id: 'charge-1',
      name: 'presidente'
    }
  ];

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    rolesApi = jasmine.createSpyObj('RolesApi', [
      'getRoles'
    ]);

    chargesApi = jasmine.createSpyObj('ChargesApi', [
      'getCharges'
    ]);

    toast = jasmine.createSpyObj('ToastMessage', [
      'success',
      'error'
    ]);

    directorsBoardApi = jasmine.createSpyObj('DirectorsBoardApi', [
      'createUser'
    ]);

    rolesApi.getRoles.and.returnValue(of(mockRoles));
    chargesApi.getCharges.and.returnValue(of(mockCharges));
    directorsBoardApi.createUser.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [AdminUserForm],
      providers: [
        {
          provide: Router,
          useValue: router
        },
        {
          provide: RolesApi,
          useValue: rolesApi
        },
        {
          provide: ChargesApi,
          useValue: chargesApi
        },
        {
          provide: ToastMessage,
          useValue: toast
        },
        {
          provide: DirectorsBoardApi,
          useValue: directorsBoardApi
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUserForm);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('AfterViewInit', () => {
    it('should get roles on init', () => {
      expect(rolesApi.getRoles)
        .toHaveBeenCalled();

      expect(component['roles']())
        .toEqual(mockRoles);
    });

    it('should get charges on init', () => {
      expect(chargesApi.getCharges)
        .toHaveBeenCalled();

      expect(component['charges']())
        .toEqual(mockCharges);
    });

    it('should show error when get roles fails', () => {
      const error: AppError = {
        message: 'Error loading roles',
        detail: 'Error loading roles',
        errors: [],
        isAuthError: false,
        isNetworkError: false,
        title: 'Error loading roles',
        type: '',
        status: 500
      };

      rolesApi.getRoles.and.returnValue(
        throwError(() => error)
      );

      fixture = TestBed.createComponent(AdminUserForm);
      component = fixture.componentInstance;

      fixture.detectChanges();

      expect(toast.error)
        .toHaveBeenCalledWith(error.message);
    });

    it('should show error when get charges fails', () => {
      const error: AppError = {
        message: 'Error loading charges',
        detail: 'Error loading charges',
        errors: [],
        isAuthError: false,
        isNetworkError: false,
        title: 'Error loading charges',
        type: '',
        status: 500
      };

      chargesApi.getCharges.and.returnValue(
        throwError(() => error)
      );

      fixture = TestBed.createComponent(AdminUserForm);
      component = fixture.componentInstance;

      fixture.detectChanges();

      expect(toast.error)
        .toHaveBeenCalledWith(error.message);
    });
  });

  describe('Form validation', () => {
    it('should mark all controls as touched when form is invalid', () => {
      spyOn(component['userForm'], 'markAllAsTouched');

      component['onUserForm']();

      expect(component['userForm'].markAllAsTouched)
        .toHaveBeenCalled();

      expect(directorsBoardApi.createUser)
        .not.toHaveBeenCalled();
    });

    it('should validate password confirmation', () => {
      component['userForm'].patchValue({
        password: 'Password123*',
        confirmPassword: 'Different123*'
      });

      expect(component['userForm'].errors)
        .toEqual(
          jasmine.objectContaining({
            passwordMismatch: true
          })
        );
    });

    it('should validate phone number pattern', () => {
      component['userForm']
        .controls['phoneNumber']
        .setValue('invalid-phone');

      expect(
        component['userForm']
          .controls['phoneNumber']
          .invalid
      ).toBeTrue();
    });

    it('should validate email pattern', () => {
      component['userForm']
        .controls['email']
        .setValue('invalid-email');

      expect(
        component['userForm']
          .controls['email']
          .invalid
      ).toBeTrue();
    });
  });

  describe('Create user service', () => {
    const validFormValue = {
      roleId: 'role-1',
      chargeId: 'charge-1',
      firstName: 'Eduardo',
      firstLastName: 'Brenes',
      secondLastName: 'Ramirez',
      password: 'Password123.',
      email: 'eduardo@test.com',
      confirmPassword: 'Password123.',
      phoneNumber: '8888-8888',
    };

    const validRequest: RegisterRequest = {
      ...validFormValue,
      phoneNumber: '8888-8888',
    };

    beforeEach(() => {
      component['userForm'].patchValue(validFormValue);
    });

    it('should create user successfully', fakeAsync(() => {
      component['onUserForm']();

      expect(component['isLoading']())
        .toBeFalse();

      expect(directorsBoardApi.createUser)
        .toHaveBeenCalledWith(validRequest);

      expect(toast.success)
        .toHaveBeenCalledWith(
          'Usuario creado exitosamente, revisar email para ser verificado.'
        );

      expect(component['userForm'].value.firstName)
        .toBe('');

      tick(500);

      expect(router.navigate)
        .toHaveBeenCalledWith(['/admin/usuarios']);
    }));

    it('should send null when phone number is empty', () => {
      component['userForm'].patchValue({
        roleId: 'role-1',
        chargeId: 'charge-1',
        firstName: 'Eduardo',
        firstLastName: 'Brenes',
        secondLastName: 'Ramirez',
        email: 'eduardo@test.com',
        password: 'Password123.',
        confirmPassword: 'Password123.',
        phoneNumber: ''
      });

      component['onUserForm']();

      expect(directorsBoardApi.createUser)
        .toHaveBeenCalledWith(
          jasmine.objectContaining<RegisterRequest>({
            phoneNumber: null
          })
        );
    });

    it('should not call API if already loading', () => {
      component['isLoading'].set(true);

      component['createUserService'](validRequest);

      expect(directorsBoardApi.createUser)
        .not.toHaveBeenCalled();
    });

    it('should show error when API fails', () => {
      const error: AppError = {
        message: 'Error creating user',
        detail: 'Error creating user',
        errors: [],
        isAuthError: false,
        isNetworkError: false,
        title: 'Error creating user',
        type: '',
        status: 400
      };

      directorsBoardApi.createUser.and.returnValue(
        throwError(() => error)
      );

      component['onUserForm']();

      expect(component['isLoading']())
        .toBeFalse();

      expect(toast.error)
        .toHaveBeenCalledWith(error.message);
    });
  });

  describe('getErrors', () => {
    it('should return validation error message', () => {
      const result = component['getErrors']({
        required: true
      });

      expect(result)
        .toBeTruthy();
    });
  });
});
