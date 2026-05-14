import { AbstractControl, ValidatorFn } from "@angular/forms";

export const fileRequired: ValidatorFn = (control: AbstractControl) => {
  const file = control.value as File | null;
  return file ? null : { required: true }
}
