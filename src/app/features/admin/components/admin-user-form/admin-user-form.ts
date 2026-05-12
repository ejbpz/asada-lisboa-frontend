import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RolesApi } from '@core/services/roles-api';
import { FormUtils } from '@shared/utils/form-utils';
import { ChargesApi } from '@core/services/charges-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { DirectorsBoardApi } from '@core/services/directors-board-api';
import { RoleResponse } from '@admin/interfaces/role-response.interface';
import { ChargeResponse } from '@admin/interfaces/charge-response.interface';
import { RegisterRequest } from '@admin/interfaces/register-request.interface';
import { confirmPasswordValidator } from '@shared/validators/confirm-password-validator';

@Component({
  selector: 'admin-user-form',
  imports: [ReactiveFormsModule, TitleCasePipe],
  templateUrl: './admin-user-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserForm implements AfterViewInit {
  // Init
  protected isLoading = signal<boolean>(false);
  protected roles = signal<RoleResponse[]>([]);
  protected charges = signal<ChargeResponse[]>([]);

  // Injection
  private router = inject(Router);
  private rolesApi = inject(RolesApi);
  private toast = inject(ToastMessage);
  private chargesApi = inject(ChargesApi);
  private formBuilder = inject(FormBuilder);
  private directorsBoardApi = inject(DirectorsBoardApi);

  // User form
  protected userForm = this.formBuilder.nonNullable.group({
    roleId: ['', Validators.required],
    chargeId: ['', Validators.required],
    firstName: ['', Validators.required],
    firstLastName: ['', Validators.required],
    secondLastName: ['', Validators.required],
    phoneNumber: ['', [Validators.pattern(FormUtils.phonePattern)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), Validators.pattern(FormUtils.passwordPattern)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), Validators.pattern(FormUtils.passwordPattern)]],
  }, {
    validators: confirmPasswordValidator('password', 'confirmPassword')
  });

  // OnSubmit form
  protected onUserForm() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.getRawValue();
    const request: RegisterRequest = {
      ...formValue,
      phoneNumber: formValue.phoneNumber?.trim() || null
    };

    this.createUserService(request);
  }

  // AfterViewInit
  ngAfterViewInit(): void {
    this.getChargesService();
    this.getRolesService();
  }

  // Calling create user API
  protected createUserService(newRequest: RegisterRequest): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.directorsBoardApi.createUser(newRequest)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.toast.success(`Usuario creado exitosamente, revisar email para ser verificado.`);
          this.userForm.reset();

          setTimeout(() => {
            this.router.navigate(['/admin/usuarios']);
          }, 500);
        },
        error: (error: AppError) => {
          this.isLoading.set(false);
          this.toast.error(error.message);
        }
      });
  }

  // Getting charges
  private getChargesService(): void {
    this.chargesApi.getCharges()
      .subscribe({
        next: (value: ChargeResponse[]) => {
          this.charges.set(value);
        },
        error: (error: AppError) => {
          this.toast.error(error.message);
        }
      });
  }

  // Getting roles
  private getRolesService(): void {
    this.rolesApi.getRoles()
      .subscribe({
        next: (value: RoleResponse[]) => {
          this.roles.set(value);
        },
        error: (error: AppError) => {
          this.toast.error(error.message);
        }
      });
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }
}
