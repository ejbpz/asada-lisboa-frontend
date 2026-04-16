import { ForgotPasswordRequest } from '@account/interfaces/forgot-password-request.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { AccountApi } from '@core/services/account-api';
import { ToastMessage } from '@shared/services/toast-message';

@Component({
  selector: 'forgot-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'md:shadow-sm md:rounded md:py-3 md:px-7'
  }
})
export class ForgotPasswordForm {
  // Init
  isLoading = signal(false);
  isError = signal<string | null>(null);
  isSuccess = signal<string | null>(null);

  // Injects
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountApi);
  private toastService = inject(ToastMessage);

  // Form
  protected forgotPasswordForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]]
  });

  // OnSubmit form
  protected onForgotPasswordForm() {
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
    this.isError.set(null);

    this.accountService.forgotPassword(forgotPasswordRequest)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.isSuccess.set('Email ha sido enviado, por favor revisar su correo.');
          this.forgotPasswordForm.reset();
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
}
