import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { AccountApi } from '@core/services/account-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
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

  token = signal<string>('');
  email = signal<string>('');

  // Injects
  private router = inject(Router);
  private toast = inject(ToastMessage);
  private formBuilder = inject(FormBuilder);
  private accountService = inject(AccountApi);
  private activatedRoute = inject(ActivatedRoute);

  // Form
  public resetPasswordForm: FormGroup = this.formBuilder.group({
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

    this.accountService.resetPassword(resetPasswordRequest)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toast.success('Contraseña actualizada con éxito.');
          this.resetPasswordForm.reset();

          this.router.navigate(['cuenta/iniciar-sesion']);
        },
        error: (error: AppError) => {
          this.isLoading.set(false);
          this.toast.error(error.message);
        }
      })
  }
}
