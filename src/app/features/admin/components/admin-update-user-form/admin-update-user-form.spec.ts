import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RolesApi } from '@core/services/roles-api';
import { ChargesApi } from '@core/services/charges-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AdminUpdateUserForm } from './admin-update-user-form';
import { AppError } from '@core/interfaces/app-error.interface';
import { DirectorsBoardApi } from '@core/services/directors-board-api';
import { RoleResponse } from '@admin/interfaces/role-response.interface';
import { ChargeResponse } from '@admin/interfaces/charge-response.interface';
import { UserUpdateRequest } from '@admin/interfaces/user-update-request.interface';
import { DirectorBoardDetailsResponse } from '@admin/interfaces/director-board-details-response.interface';

describe('AdminUpdateUserForm', () => {
  let component: AdminUpdateUserForm;
  let fixture: ComponentFixture<AdminUpdateUserForm>;

  let rolesApi: jasmine.SpyObj<RolesApi>;
  let chargesApi: jasmine.SpyObj<ChargesApi>;
  let toast: jasmine.SpyObj<ToastMessage>;
  let router: jasmine.SpyObj<Router>;
  let directorsBoardApi: jasmine.SpyObj<DirectorsBoardApi>;

  const mockRoles: RoleResponse[] = [
    {
      id: 'role-1',
      name: 'admin'
    } as RoleResponse
  ];

  const mockCharges: ChargeResponse[] = [
    {
      id: 'charge-1',
      name: 'presidente'
    } as ChargeResponse
  ];

  const mockUser: DirectorBoardDetailsResponse = {
    id: 'user-1',
    chargeId: 'charge-1',
    firstName: 'Eduardo',
    firstLastName: 'Brenes',
    secondLastName: 'Ramirez',
    phoneNumber: '8888-8888',
    roles: [
      {
        id: 'role-1',
        name: 'admin'
      }
    ]
  } as DirectorBoardDetailsResponse;

  beforeEach(async () => {
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

    router = jasmine.createSpyObj('Router', [
      'navigate'
    ]);

    directorsBoardApi = jasmine.createSpyObj('DirectorsBoardApi', [
      'updateUser'
    ]);

    rolesApi.getRoles.and.returnValue(of(mockRoles));
    chargesApi.getCharges.and.returnValue(of(mockCharges));
    directorsBoardApi.updateUser.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [AdminUpdateUserForm],
      providers: [
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
          provide: Router,
          useValue: router
        },
        {
          provide: DirectorsBoardApi,
          useValue: directorsBoardApi
        }
      ]
    })
    .overrideComponent(AdminUpdateUserForm, {
      set: {
        inputs: ['userToUpdate']
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateUserForm);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('userToUpdate', mockUser);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should load roles on init', () => {
      expect(rolesApi.getRoles)
        .toHaveBeenCalled();
    });

    it('should load charges on init', () => {
      expect(chargesApi.getCharges)
        .toHaveBeenCalled();
    });

    it('should patch form in edit mode', () => {
      expect(component['userForm'].value).toEqual({
        roleId: 'role-1',
        chargeId: 'charge-1',
        firstName: 'Eduardo',
        firstLastName: 'Brenes',
        secondLastName: 'Ramirez',
        phoneNumber: '8888-8888'
      });
    });

    it('should redirect if user is invalid', () => {
      const newFixture = TestBed.createComponent(AdminUpdateUserForm);
      const newComponent = newFixture.componentInstance;

      newFixture.componentRef.setInput('userToUpdate', null);

      newFixture.detectChanges();

      expect(router.navigate)
        .toHaveBeenCalledWith(['/admin/usuarios']);

      expect(newComponent)
        .toBeTruthy();
    });
  });

  describe('Form validation', () => {
    it('should validate required fields', () => {
      component['userForm'].patchValue({
        roleId: '',
        chargeId: '',
        firstName: '',
        firstLastName: '',
        secondLastName: ''
      });

      expect(component['userForm'].invalid)
        .toBeTrue();

      expect(component['userForm'].get('roleId')?.hasError('required'))
        .toBeTrue();

      expect(component['userForm'].get('chargeId')?.hasError('required'))
        .toBeTrue();

      expect(component['userForm'].get('firstName')?.hasError('required'))
        .toBeTrue();

      expect(component['userForm'].get('firstLastName')?.hasError('required'))
        .toBeTrue();

      expect(component['userForm'].get('secondLastName')?.hasError('required'))
        .toBeTrue();
    });

    it('should validate phone pattern', () => {
      component['userForm'].patchValue({
        phoneNumber: 'invalid-phone'
      });

      expect(component['userForm']
        .get('phoneNumber')
        ?.hasError('pattern'))
        .toBeTrue();
    });

    it('should mark form as touched if invalid', () => {
      spyOn(component['userForm'], 'markAllAsTouched');

      component['userForm'].patchValue({
        roleId: '',
        chargeId: ''
      });

      component['onUserForm']();

      expect(component['userForm'].markAllAsTouched)
        .toHaveBeenCalled();

      expect(directorsBoardApi.updateUser)
        .not.toHaveBeenCalled();
    });
  });

  describe('Update user service', () => {
    beforeEach(() => {
      component['userForm'].patchValue({
        roleId: 'role-1',
        chargeId: 'charge-1',
        firstName: 'Eduardo',
        firstLastName: 'Brenes',
        secondLastName: 'Ramirez',
        phoneNumber: '8888-8888'
      });
    });

    it('should update user successfully', fakeAsync(() => {
      component['onUserForm']();

      expect(directorsBoardApi.updateUser)
        .toHaveBeenCalledWith(
          'user-1',
          jasmine.objectContaining<UserUpdateRequest>({
            roleId: 'role-1',
            chargeId: 'charge-1',
            firstName: 'Eduardo',
            firstLastName: 'Brenes',
            secondLastName: 'Ramirez',
            phoneNumber: '8888-8888'
          })
        );

      expect(toast.success)
        .toHaveBeenCalledWith('Usuario actualizado exitosamente');

      expect(component['isLoading']())
        .toBeFalse();

      tick(500);

      expect(router.navigate)
        .toHaveBeenCalledWith(['/admin/usuarios']);
    }));

    it('should trim phone number or send null', () => {
      component['createUserService']({
        roleId: 'role-1',
        chargeId: 'charge-1',
        firstName: 'Eduardo',
        firstLastName: 'Brenes',
        secondLastName: 'Ramirez',
        phoneNumber: null
      });

      expect(directorsBoardApi.updateUser)
        .toHaveBeenCalledWith(
          'user-1',
          jasmine.objectContaining<UserUpdateRequest>({
            phoneNumber: null
          })
        );
    });

    it('should not call service if loading', () => {
      component['isLoading'].set(true);

      component['createUserService']({
        roleId: 'role-1',
        chargeId: 'charge-1',
        firstName: 'Eduardo',
        firstLastName: 'Brenes',
        secondLastName: 'Ramirez',
        phoneNumber: null
      });

      expect(directorsBoardApi.updateUser)
        .not.toHaveBeenCalled();
    });

    it('should show error toast when API fails', () => {
      const error: AppError = {
        message: 'Error updating user'
      } as AppError;

      directorsBoardApi.updateUser.and.returnValue(
        throwError(() => error)
      );

      component['onUserForm']();

      expect(toast.error)
        .toHaveBeenCalledWith('Error updating user');

      expect(component['isLoading']())
        .toBeFalse();
    });
  });

  describe('Roles service', () => {
    it('should set roles successfully', () => {
      expect(component['roles']())
        .toEqual(mockRoles);
    });

    it('should show error toast if roles API fails', () => {
      const error: AppError = {
        message: 'Roles error'
      } as AppError;

      rolesApi.getRoles.and.returnValue(
        throwError(() => error)
      );

      const newFixture = TestBed.createComponent(AdminUpdateUserForm);

      newFixture.componentRef.setInput('userToUpdate', mockUser);

      newFixture.detectChanges();

      expect(toast.error)
        .toHaveBeenCalledWith('Roles error');
    });
  });

  describe('Charges service', () => {
    it('should set charges successfully', () => {
      expect(component['charges']())
        .toEqual(mockCharges);
    });

    it('should show error toast if charges API fails', () => {
      const error: AppError = {
        message: 'Charges error'
      } as AppError;

      chargesApi.getCharges.and.returnValue(
        throwError(() => error)
      );

      const newFixture = TestBed.createComponent(AdminUpdateUserForm);

      newFixture.componentRef.setInput('userToUpdate', mockUser);

      newFixture.detectChanges();

      expect(toast.error)
        .toHaveBeenCalledWith('Charges error');
    });
  });

  describe('Helpers', () => {
    it('should return form errors', () => {
      const result = component['getErrors']({
        required: true
      });

      expect(result)
        .toBeTruthy();
    });
  });

  describe('Template rendering', () => {
    it('should render submit button', () => {
      const button = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );

      expect(button)
        .toBeTruthy();
    });

    it('should render roles select options', () => {
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(
        By.css('select[formControlName="roleId"] option')
      );

      expect(options.length)
        .toBeGreaterThan(1);
    });

    it('should render charges select options', () => {
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(
        By.css('select[formControlName="chargeId"] option')
      );

      expect(options.length)
        .toBeGreaterThan(1);
    });
  });
});
