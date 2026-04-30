import { ValidationErrors } from "@angular/forms";

export class FormUtils {
  public static numberPattern = '^[0-9]+$';
  public static textPattern = '^[a-zA-Z\\s]+$';
  public static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
  public static phonePattern = '^(?:\\d{8}|\\d{4}-\\d{4}|(?:\\d{2}-){3}\\d{2})$';
  public static passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&\\.*]).{8,}$';

  public static getErrors(errors: ValidationErrors): string | null | undefined {
    for(const errorKey of Object.keys(errors)) {
      switch(errorKey) {
        case 'required':
          return 'Este campo es requerido.';
        case 'fileType':
          return 'El tipo de imagen no es soportada.';
        case 'fileSize':
          return 'El tamaño de la imagen no es soportada.';
        case 'passwordMismatch':
          return 'Ambas contraseñas deben ser idénticas.';
        case 'minlength':
          return `Debe contener mínimo ${errors[errorKey].requiredLength} caracteres.`;
        case 'maxlength':
          return `Debe contener máximo ${errors[errorKey].requiredLength} caracteres.`;
        case 'pattern':
          if(errors[errorKey].requiredPattern == this.emailPattern)
            return 'No corresponde al formato de un correo.';

          if(errors[errorKey].requiredPattern == this.phonePattern)
            return 'No corresponde al formato de un teléfono.';

          if(errors[errorKey].requiredPattern == this.passwordPattern)
            return 'No corresponde al formato de contraseña.';

          if(errors[errorKey].requiredPattern == this.textPattern)
            return 'Este campo solo acepta texto y espacios.';

          if(errors[errorKey].requiredPattern == this.numberPattern)
            return 'Este campo solo acepta números.';
      }
    }

    return null;
  }
}
