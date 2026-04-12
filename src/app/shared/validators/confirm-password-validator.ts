import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const confirmPasswordValidator = (passwordKey: string, confirmPasswordKey: string): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey);
    const confirmPassword = group.get(confirmPasswordKey);

    if(!password || !confirmPassword)
      return null;

    if(password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if(confirmPassword.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];

      if(Object.keys(errors).length < 1)
        confirmPassword.setErrors(null);
      else
        confirmPassword.setErrors(errors);
    }

    return null;
  }
}
