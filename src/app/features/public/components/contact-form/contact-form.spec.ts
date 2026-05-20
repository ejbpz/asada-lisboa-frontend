import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContactForm } from './contact-form';
import { ContactApi } from '@core/services/contact-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';

describe('ContactForm', () => {
  let component: ContactForm;
  let fixture: ComponentFixture<ContactForm>;

  let contactApi: jasmine.SpyObj<ContactApi>;
  let toast: jasmine.SpyObj<ToastMessage>;

  beforeEach(async () => {
    contactApi = jasmine.createSpyObj('ContactApi', [
      'recaptchaValidation',
      'contactEmail'
    ]);

    toast = jasmine.createSpyObj('ToastMessage', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [ContactForm, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ContactApi, useValue: contactApi },
        { provide: ToastMessage, useValue: toast }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as touched and not submit when invalid', () => {
    component['captchaToken'] = 'token';

    component.contactForm.patchValue({
      fullName: '',
      email: '',
      subject: '',
      message: ''
    });

    component['oncontactForm']();

    expect(contactApi.recaptchaValidation).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should show error when captcha is missing', () => {
    component.contactForm.patchValue({
      fullName: 'Juan Perez',
      email: 'test@test.com',
      subject: 'Asunto válido',
      message: 'Este es un mensaje suficientemente largo para pasar validación'
    });

    component['oncontactForm']();

    expect(toast.error).toHaveBeenCalledWith('ReCAPTCHA obligatorio.');
  });

  it('should not send email when captcha validation fails', fakeAsync(() => {
    component['captchaToken'] = 'token';

    contactApi.recaptchaValidation.and.returnValue(of(false));

    component.contactForm.patchValue({
      fullName: 'Juan Perez',
      email: 'test@test.com',
      subject: 'Asunto válido',
      message: 'Mensaje suficientemente largo para pasar validación'
    });

    component['oncontactForm']();

    tick();

    expect(contactApi.contactEmail).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('ReCAPTCHA fallido.');
  }));

  it('should send email successfully and reset form', fakeAsync(() => {
    component['captchaToken'] = 'token';

    contactApi.recaptchaValidation.and.returnValue(of(true));
    contactApi.contactEmail.and.returnValue(of(void 0));

    spyOn(component.contactForm, 'reset');

    component.contactForm.patchValue({
      fullName: 'Juan Perez',
      email: 'test@test.com',
      subject: 'Asunto válido',
      message: 'Mensaje suficientemente largo para pasar validación'
    });

    component['oncontactForm']();

    tick();

    expect(contactApi.contactEmail).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalled();
    expect(component.contactForm.reset).toHaveBeenCalled();
  }));

  it('should handle recaptcha validation error', fakeAsync(() => {
    component['captchaToken'] = 'token';

    const error: AppError = { message: 'error recaptcha' } as AppError;

    contactApi.recaptchaValidation.and.returnValue(
      throwError(() => error)
    );

    component.contactForm.patchValue({
      fullName: 'Juan Perez',
      email: 'test@test.com',
      subject: 'Asunto válido',
      message: 'Mensaje suficientemente largo para pasar validación'
    });

    component['oncontactForm']();

    tick();

    expect(toast.error).toHaveBeenCalledWith('error recaptcha');
  }));

  it('should not call contactEmail if already loading', () => {
    component['isLoading'].set(true);

    (component as any).contactApiService({
      fullName: 'Juan',
      email: 'test@test.com',
      subject: 'Asunto',
      message: 'Mensaje válido suficientemente largo'
    });

    expect(contactApi.contactEmail).not.toHaveBeenCalled();
  });
});
