import { Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms'
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
  private loginRequest = signal<LoginRequest | null>(null);

  // Injects
  private formBuilder = inject(FormBuilder);
  private authApiService = inject(AuthApi);
  private router = inject(Router);

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

    let data = this.loginForm.value;
    this.loginRequest.set(data);

    this.loginForm.reset();
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  // Calling login API
  protected loginService = rxResource({
    params: () => ({ query: this.loginRequest() }),
    stream: ({ params }) => {
      if(!params.query)
        return of();

      return this.authApiService.loginUser(params.query);
    }
  })
}
