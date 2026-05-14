import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { AccountApi } from '@core/services/account-api';
import { ToastMessage } from '@shared/services/toast-message';
import { confirmPasswordValidator } from '@shared/validators/confirm-password-validator';
import { ResetPasswordRequest } from '@account/interfaces/reset-password-request.interface';

@Component({
  selector: 'reset-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mt-5 md:shadow-sm md:rounded md:py-3 md:px-7'
  }
})
export class ResetPasswordForm implements AfterViewInit {
  // Init
  isLoading = signal(false);
  isError = signal<string | null>(null);
  isSuccess = signal<string | null>(null);

  token = signal<string>('');
  email = signal<string>('');

  // Injects
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountApi);
  private toastService = inject(ToastMessage);
  private activatedRoute = inject(ActivatedRoute);

  // Form
  protected resetPasswordForm: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(FormUtils.passwordPattern)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(FormUtils.passwordPattern)]]
  }, {
    validators: confirmPasswordValidator('password', 'confirmPassword')
  });

  // OnInit
  ngAfterViewInit(): void {
    this.token.set(this.activatedRoute.snapshot.queryParamMap.get('token') ?? '');
    this.email.set(this.activatedRoute.snapshot.queryParamMap.get('email') ?? '');
  }

  // OnSubmit form
  protected onForgotPasswordForm() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const formValue: ResetPasswordRequest = {
      email: this.email(),
      token: this.token(),
      password: this.resetPasswordForm.controls['password'].value,
      confirmPassword: this.resetPasswordForm.controls['confirmPassword'].value,
    }

    this.resetPasswordService(formValue);
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  // Calling login API
  protected resetPasswordService(resetPasswordRequest: ResetPasswordRequest): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.accountService.resetPassword(resetPasswordRequest)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.isSuccess.set('Contraseña actualizada con éxito.');
          this.resetPasswordForm.reset();

          this.router.navigate(['cuenta/iniciar-sesion']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.isError.set(error.message);
        }
      })
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
