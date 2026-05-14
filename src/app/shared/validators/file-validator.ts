import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function fileValidator(options: {
  maxSizeMb: number;
  allowedExtensions: string[];
}): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;

    if(!file)
      return null;

    const errors: ValidationErrors = {};

    // Extension validation
    if(options.allowedExtensions && !options.allowedExtensions.includes(file.type)) {
      errors['fileType'] = {
        allowedExtensions: options.allowedExtensions,
        actualExtension: file.type
      };
    }

    // Size validation
    if(options.maxSizeMb) {
      const maxBytes = options.maxSizeMb * 1024 * 1024;

      if(file.size > maxBytes) {
        errors['fileSize'] = {
          maxSizeMb: options.maxSizeMb,
          actualSizeMb: (file.size / 1024 / 1024).toFixed(2)
        };
      }
    }

    return Object.keys(errors).length ? errors : null;
  };
}
