import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { ContactApi } from '@core/services/contact-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { environment } from '@environments/environment.development';
import { EmailContactRequest } from '@public/interfaces/email-contact-request.interface';
import { ReCaptchaValidator } from "@shared/components/re-captcha-validator/re-captcha-validator";

@Component({
  selector: 'contact-form',
  imports: [ReactiveFormsModule, ReCaptchaValidator],
  templateUrl: './contact-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center'
  }
})
export class ContactForm {
  // Init
  protected env = environment;
  protected isLoading = signal(false);
  private captchaToken: string | null = null;

  // Injector
  private toast = inject(ToastMessage);
  protected formBuilder = inject(FormBuilder);
  protected contactService = inject(ContactApi);

  // Form
  protected contactForm: FormGroup = this.formBuilder.group({
    phoneNumber: ['', [Validators.pattern(FormUtils.phonePattern)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    subject: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
    message: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(320)]],
    fullName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern(new RegExp(FormUtils.textPattern, 'u'))]]
  });

  // OnSubmit form
  protected oncontactForm() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    if (!this.captchaToken) {
      this.toast.error('ReCAPTCHA obligatorio.');
      return;
    }

    this.contactService.recaptchaValidation(this.captchaToken)
      .subscribe({
        next: (isValid: boolean) => {
          if(!isValid)
            this.toast.error('ReCAPTCHA fallido.');

          this.contactApiService(this.contactForm.value);
        },
        error: (error: AppError) => {
          this.toast.error(error.message);
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

    this.contactService.contactEmail(emailContactRequest)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toast.success('Email enviado exitosamente, pronta respuesta.');

          this.contactForm.reset();
        },
        error: (error: AppError) => {
          this.isLoading.set(false);
          this.toast.error(error.message);
        }
      });
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }
}
