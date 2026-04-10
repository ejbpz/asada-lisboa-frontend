import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms'
import { FormUtils } from '@shared/utils/form-utils';

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
  private formBuilder = inject(FormBuilder);

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

    this.loginForm.reset();
  }

  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }
}
