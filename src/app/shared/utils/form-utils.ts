import { ValidationErrors } from "@angular/forms";

export class FormUtils {
  public static getErrors(errors: ValidationErrors): string | null | undefined {
    for(const errorKey of Object.keys(errors)) {
      switch(errorKey) {
        case 'required':
          return 'Este campo es requerido.';
        case 'minlength':
          return `Debe contener mínimo ${errors[errorKey].requiredLength} caracteres.`;
      }
    }

    return null;
  }
}
