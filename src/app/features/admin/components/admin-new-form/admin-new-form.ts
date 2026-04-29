import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormUtils } from '@shared/utils/form-utils';
import { RichTextEditor } from "../rich-text-editor/rich-text-editor";

@Component({
  selector: 'admin-new-form',
  imports: [ReactiveFormsModule, RichTextEditor],
  templateUrl: './admin-new-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNewForm {
  // Injections
  private formBuilder = inject(FormBuilder);

  // New form
  protected newsForm: FormGroup = this.formBuilder.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    content: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]],
    file: [null]
  });

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  // Image preview
  protected imagePreview = signal<string | null>(null);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Guardar archivo en el form
    this.newsForm.patchValue({ image: file });

    // Generar preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }
}
