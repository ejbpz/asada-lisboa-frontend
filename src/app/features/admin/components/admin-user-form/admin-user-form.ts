import { TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RolesApi } from '@core/services/roles-api';
import { FormUtils } from '@shared/utils/form-utils';
import { ChargesApi } from '@core/services/charges-api';
import { ToastMessage } from '@shared/services/toast-message';
import { RoleResponse } from '@admin/interfaces/role-response.interface';
import { ChargeResponse } from '@admin/interfaces/charge-response.interface';
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
  private isError = signal<string | null>(null);
  private isSuccess = signal<string | null>(null);
  protected roles = signal<RoleResponse[]>([]);
  protected charges = signal<ChargeResponse[]>([]);

  // Injection
  private rolesApi = inject(RolesApi);
  private chargesApi = inject(ChargesApi);
  private formBuilder = inject(FormBuilder);
    private toastService = inject(ToastMessage);

  // User form
  protected userForm = this.formBuilder.group({
    roleId: ['', [Validators.required]],
    chargeId: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    firstLastName: ['', [Validators.required]],
    secondLastName: ['', [Validators.required]],
    phoneNumber: ['', [Validators.pattern(FormUtils.phonePattern)]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],

    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), Validators.pattern(FormUtils.phonePattern)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), Validators.pattern(FormUtils.phonePattern)]],
  }, {
    validators: confirmPasswordValidator('password', 'confirmPassword')
  });

  // AfterViewInit
  ngAfterViewInit(): void {
    this.getChargesService();
    this.getRolesService();
  }

  // Getting charges
  private getChargesService(): void {
    this.chargesApi.getCharges()
      .subscribe({
        next: (value: ChargeResponse[]) => {
          this.charges.set(value);
        },
        error: (error: HttpErrorResponse) => {
          this.isError.set(error.error);
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
        error: (error: HttpErrorResponse) => {
          this.isError.set(error.error);
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
  });

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }
}
