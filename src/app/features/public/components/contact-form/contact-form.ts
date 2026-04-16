import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { ContactApi } from '@core/services/contact-api';
import { ToastMessage } from '@shared/services/toast-message';
import { EmailContactRequest } from '@public/interfaces/email-contact-request.interface';
import { environment } from '@environments/environment.development';

@Component({
  selector: 'contact-form',
  imports: [ReactiveFormsModule],
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
  protected isError = signal<string | null>(null);
  protected isSuccess = signal<string | null>(null);

  // Injector
  protected formBuilder = inject(FormBuilder);
  private toastService = inject(ToastMessage);
  protected contactService = inject(ContactApi);

  // Form
  protected contactForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(FormUtils.phonePattern)]],
    subject: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(600)]],
    fullName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50), Validators.pattern(FormUtils.textPattern)]]
  });

  // OnSubmit form
  protected oncontactForm() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.contactApiService(this.contactForm.value);
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
