import { Router, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms'
import { AuthApi } from '@core/services/auth-api';
import { FormUtils } from '@shared/utils/form-utils';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { LoginRequest } from '@account/interfaces/login-request.interface';

@Component({
  selector: 'login-form',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mt-5 md:shadow-sm md:rounded md:py-3 md:px-7'
  }
})
export class LoginForm {
  // Init
  isLoading = signal(false);

  // Injects
  private router = inject(Router);
  private toast = inject(ToastMessage);
  private authApiService = inject(AuthApi);
  private formBuilder = inject(FormBuilder);

  // Form
  public loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(FormUtils.passwordPattern)]],
  });

  // OnSubmit form
  public onLoginUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginService(this.loginForm.value);
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  // Calling login API
  protected loginService(loginRequest: LoginRequest): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.authApiService.loginUser(loginRequest)
      .subscribe({
        next: (isValid: boolean) => {
          this.isLoading.set(false);
          this.loginForm.reset();

          if(isValid)
            this.router.navigate(['/admin']);
        },
        error: (error: AppError) => {
          this.isLoading.set(false);
          this.toast.error(error.message);
        }
      })
  }
}
