import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { AccountApi } from '@core/services/account-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { ForgotPasswordRequest } from '@account/interfaces/forgot-password-request.interface';

@Component({
  selector: 'forgot-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'md:shadow-sm mt-5 md:rounded md:py-3 md:px-7'
  }
})
export class ForgotPasswordForm {
  // Init
  isLoading = signal(false);

  // Injections
  private toast = inject(ToastMessage);
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountApi);

  // Form
  public forgotPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]]
  });

  // OnSubmit form
  public onForgotPasswordForm() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.forgotPasswordService(this.forgotPasswordForm.value);
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  // Calling login API
  protected forgotPasswordService(forgotPasswordRequest: ForgotPasswordRequest): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.accountService.forgotPassword(forgotPasswordRequest)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toast.success('Email ha sido enviado, por favor revisar su correo.');
          this.forgotPasswordForm.reset();
        },
        error: (error: AppError) => {
          this.isLoading.set(false);
          this.toast.error(error.message);
        }
      });
  }
}
