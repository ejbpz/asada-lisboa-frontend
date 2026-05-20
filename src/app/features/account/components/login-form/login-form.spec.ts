import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoginForm } from './login-form';
import { AuthApi } from '@core/services/auth-api';
import { ToastMessage } from '@shared/services/toast-message';

class AuthApiMock {
  loginUser = jasmine.createSpy('loginUser');
}

class ToastMock {
  error = jasmine.createSpy('error');
}

describe('LoginForm', () => {
  let fixture: ComponentFixture<LoginForm>;
  let component: LoginForm;

  let authApi: AuthApiMock;
  let toast: ToastMock;
  let router: Router;

  beforeEach(async () => {
    authApi = new AuthApiMock();
    toast = new ToastMock();

    await TestBed.configureTestingModule({
      imports: [
        LoginForm,
        ReactiveFormsModule
      ],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: AuthApi, useValue: authApi },
        { provide: ToastMessage, useValue: toast }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
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

  function getSubmitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button[type="submit"]');
  }

  it('should create component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.value.email).toBe('');
    expect(component.loginForm.value.password).toBe('');
  });

  it('should mark form as touched when invalid submit occurs', () => {
    spyOn(component.loginForm, 'markAllAsTouched');

    submitForm();

    expect(component.loginForm.markAllAsTouched).toHaveBeenCalled();
    expect(authApi.loginUser).not.toHaveBeenCalled();
  });

  it('should show validation error when email is invalid and touched', () => {
    const email = fixture.nativeElement.querySelector('input[formControlName="email"]');

    email.value = 'invalid-email';
    email.dispatchEvent(new Event('input'));
    email.dispatchEvent(new Event('blur'));

    component.loginForm.controls['email'].markAsTouched();
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.text-error');
    expect(error).toBeTruthy();
  });

  it('should call login API when form is valid', () => {
    authApi.loginUser.and.returnValue(of(true));

    component.loginForm.setValue({
      email: 'test@mail.com',
      password: 'Password123!'
    });

    submitForm();

    expect(authApi.loginUser).toHaveBeenCalled();
  });

  it('should navigate to /admin when login is successful', () => {
    authApi.loginUser.and.returnValue(of(true));

    component.loginForm.setValue({
      email: 'test@mail.com',
      password: 'Password123!'
    });

    submitForm();

    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should show toast error when login fails', () => {
    authApi.loginUser.and.returnValue({
      subscribe: (handlers: any) => handlers.error({ message: 'Error login' })
    });

    component.loginForm.setValue({
      email: 'test@mail.com',
      password: 'Password123!'
    });

    submitForm();

    expect(toast.error).toHaveBeenCalledWith('Error login');
  });

  it('should disable submit button when loading is true', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    const button = getSubmitButton();

    expect(button.disabled).toBeTrue();
  });

  it('should show loading spinner when isLoading is true', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.loading-spinner');

    expect(spinner).toBeTruthy();
  });
});
