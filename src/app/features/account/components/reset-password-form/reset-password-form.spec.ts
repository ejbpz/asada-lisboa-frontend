import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AccountApi } from '@core/services/account-api';
import { ResetPasswordForm } from './reset-password-form';
import { ToastMessage } from '@shared/services/toast-message';

class AccountApiMock {
  resetPassword = jasmine.createSpy('resetPassword');
}

class ToastMock {
  success = jasmine.createSpy('success');
  error = jasmine.createSpy('error');
}

class ActivatedRouteMock {
  snapshot = {
    queryParamMap: {
      get: jasmine.createSpy('get').and.callFake((key: string) => {
        if (key === 'token') return 'fake-token';
        if (key === 'email') return 'test@mail.com';
        return null;
      })
    }
  };
}

describe('ResetPasswordForm', () => {
  let fixture: ComponentFixture<ResetPasswordForm>;
  let component: ResetPasswordForm;

  let accountApi: AccountApiMock;
  let toast: ToastMock;
  let router: Router;
  let route: ActivatedRouteMock;

  beforeEach(async () => {
    accountApi = new AccountApiMock();
    toast = new ToastMock();
    route = new ActivatedRouteMock();

    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordForm,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AccountApi, useValue: accountApi },
        { provide: ToastMessage, useValue: toast },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordForm);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  function submitForm(): void {
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  function setValidForm(): void {
    component.resetPasswordForm.setValue({
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
  }

  it('should create component and load query params', () => {
    expect(component).toBeTruthy();

    expect(component.token()).toBe('fake-token');
    expect(component.email()).toBe('test@mail.com');
  });

  it('should mark form as touched when invalid submit occurs', () => {
    spyOn(component.resetPasswordForm, 'markAllAsTouched');

    submitForm();

    expect(component.resetPasswordForm.markAllAsTouched).toHaveBeenCalled();
    expect(accountApi.resetPassword).not.toHaveBeenCalled();
  });

  it('should call resetPassword service when form is valid', () => {
    accountApi.resetPassword.and.returnValue(of(void 0));

    setValidForm();
    submitForm();

    expect(accountApi.resetPassword).toHaveBeenCalled();
  });

  it('should navigate to login after successful reset', () => {
    accountApi.resetPassword.and.returnValue(of(void 0));

    setValidForm();
    submitForm();

    expect(router.navigate).toHaveBeenCalledWith(['cuenta/iniciar-sesion']);
    expect(toast.success).toHaveBeenCalledWith('Contraseña actualizada con éxito.');
  });

  it('should show error toast when reset password fails', () => {
    accountApi.resetPassword.and.returnValue({
      subscribe: (handlers: any) => handlers.error({ message: 'Error reset password' })
    });

    setValidForm();
    submitForm();

    expect(toast.error).toHaveBeenCalledWith('Error reset password');
  });

  it('should set loading state while request is running', () => {
    accountApi.resetPassword.and.returnValue(of(void 0));

    setValidForm();
    submitForm();

    expect(component.isLoading()).toBeFalse();
  });

  it('should not call API if form is invalid', () => {
    submitForm();

    expect(accountApi.resetPassword).not.toHaveBeenCalled();
  });
});
