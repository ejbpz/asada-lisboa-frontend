import { ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AccountApi } from '@core/services/account-api';
import { ForgotPasswordForm } from './forgot-password-form';
import { ToastMessage } from '@shared/services/toast-message';

describe('ForgotPasswordForm', () => {
  const accountApiMock = {
    forgotPassword: jasmine.createSpy('forgotPassword')
  };

  const toastMock = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  let fixture: ComponentFixture<ForgotPasswordForm>;
  let component: ForgotPasswordForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordForm, ReactiveFormsModule],
      providers: [
        { provide: AccountApi, useValue: accountApiMock },
        { provide: ToastMessage, useValue: toastMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not call API when form is invalid', () => {
    accountApiMock.forgotPassword.calls.reset();

    component.forgotPasswordForm.setValue({ email: '' });

    component.onForgotPasswordForm();

    expect(accountApiMock.forgotPassword).not.toHaveBeenCalled();
  });

  it('should call forgotPassword API when form is valid', () => {
    accountApiMock.forgotPassword.and.returnValue(of({}));

    component.forgotPasswordForm.setValue({
      email: 'test@mail.com'
    });

    component.onForgotPasswordForm();

    expect(accountApiMock.forgotPassword).toHaveBeenCalledWith({
      email: 'test@mail.com'
    });
  });

  it('should show success toast and reset form on success', () => {
    accountApiMock.forgotPassword.and.returnValue(of({}));

    component.forgotPasswordForm.setValue({
      email: 'test@mail.com'
    });

    component.onForgotPasswordForm();

    expect(toastMock.success).toHaveBeenCalledWith(
      'Email ha sido enviado, por favor revisar su correo.'
    );

    expect(component.forgotPasswordForm.value.email).toBeNull();
  });

  it('should show error toast when API fails', () => {
    accountApiMock.forgotPassword.and.returnValue(
      throwError(() => ({ message: 'Error server' }))
    );

    component.forgotPasswordForm.setValue({
      email: 'test@mail.com'
    });

    component.onForgotPasswordForm();

    expect(toastMock.error).toHaveBeenCalledWith('Error server');
  });

  it('should not call API when isLoading is true', () => {
    accountApiMock.forgotPassword.calls.reset();

    component.isLoading.set(true);

    fixture.detectChanges();

    component.forgotPasswordForm.setValue({
      email: 'test@mail.com'
    });

    component.onForgotPasswordForm();

    expect(accountApiMock.forgotPassword.calls.count()).toBe(0);
  });

  it('should disable button when loading is true', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBeTrue();
  });

  it('should bind input to form control', () => {
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');

    input.value = 'test@mail.com';
    input.dispatchEvent(new Event('input'));

    expect(component.forgotPasswordForm.value.email).toBe('test@mail.com');
  });
});
