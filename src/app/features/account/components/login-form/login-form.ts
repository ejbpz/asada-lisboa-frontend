import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms'
import { HotToastService } from '@ngxpert/hot-toast';
import { AuthApi } from '@core/services/auth-api';
import { FormUtils } from '@shared/utils/form-utils';
import { LoginRequest } from '@account/interfaces/login-request.interface';

@Component({
  selector: 'login-form',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'md:shadow-sm md:rounded md:py-3 md:px-7'
  }
})
export class LoginForm {
  // Init
  isLoading = signal(false);
  isError = signal<string | null>(null);

  // Injects
  private authApiService = inject(AuthApi);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(HotToastService);

  // Form
  protected loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(FormUtils.passwordPattern)]],
  });

  // OnSubmit form
  protected onLoginUser() {
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
    this.isError.set(null);

    this.authApiService.loginUser(loginRequest)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.loginForm.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.isError.set(error.message);
        }
      })
  }

  // Toast error
  protected showError = effect(() => {
    const error = this.isError();

    if(!error) return;

    this.toastService.show(this.isError()!, {
      icon: '❌',
      theme: 'snackbar',
      position: 'top-right',
    });

    this.isError.set(null);
  });
}
