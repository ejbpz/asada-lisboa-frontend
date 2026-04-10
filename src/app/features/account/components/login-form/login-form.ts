import { RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms'
import { FormUtils } from '@shared/utils/form-utils';
import { AuthApi } from '@core/services/auth-api';
import { LoginRequest } from '@account/interfaces/login-request.interface';
import { of } from 'rxjs';

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
  private loginRequest = signal<LoginRequest | null>(null);

  private formBuilder = inject(FormBuilder);
  private authApiService = inject(AuthApi);

  protected loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected onLoginUser() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    let data = this.loginForm.value;
    this.loginRequest.set(data);

    this.loginForm.reset();
  }

  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  private loginService = rxResource({
    params: () => ({ query: this.loginRequest() }),
    stream: ({ params }) => {
      if(!params.query)
        return of();

      return this.authApiService.loginUser(params.query);
    }
  })
}
