import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { ContactApi } from '@core/services/contact-api';
import { ToastMessage } from '@shared/services/toast-message';
import { EmailContactRequest } from '@public/interfaces/email-contact-request.interface';
import { environment } from '@environments/environment.development';
import { ReCaptchaValidator } from "@shared/components/re-captcha-validator/re-captcha-validator";

@Component({
  selector: 'contact-form',
  imports: [ReactiveFormsModule, ReCaptchaValidator],
  templateUrl: './contact-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center md:w-1/2'
  }
})
export class ContactForm {
  // Init
  protected env = environment;
  protected isLoading = signal(false);
  private captchaToken: string | null = null;
  protected isError = signal<string | null>(null);
  protected isSuccess = signal<string | null>(null);

  // Injector
  protected formBuilder = inject(FormBuilder);
  private toastService = inject(ToastMessage);
  protected contactService = inject(ContactApi);

  // Form
  protected contactForm: FormGroup = this.formBuilder.group({
    phoneNumber: ['', [Validators.pattern(FormUtils.phonePattern)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(320)]],
    fullName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(FormUtils.textPattern)]]
  });

  // OnSubmit form
  protected oncontactForm() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    if (!this.captchaToken) {
      this.isError.set('ReCAPTCHA obligatorio.');
      return;
    }

    this.contactService.recaptchaValidation(this.captchaToken)
      .subscribe({
        next: (isValid: boolean) => {
          if(!isValid)
            this.isError.set('ReCAPTCHA fallido.');

          this.contactApiService(this.contactForm.value);
        },
        error: (error: HttpErrorResponse) => {
          this.isError.set(error.message);
        }
      });

  }

  // Captcha resolve
  protected onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
  }

  // Contact service
  private contactApiService(emailContactRequest: EmailContactRequest): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.contactService.contactEmail(emailContactRequest)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.isSuccess.set('Email enviado exitosamente, pronta respuesta.');

          this.contactForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.isError.set(error.message);
        }
      });
  }

  // Toast error
  private showToast = effect(() => {
    this.toastService.showToast(
      this.isError() ? this.isError() : this.isSuccess(),
      this.isError() ? '❌' : '✔'
    );

    this.isError.set(null);
    this.isSuccess.set(null);
  });

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }
}
