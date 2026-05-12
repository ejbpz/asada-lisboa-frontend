import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormUtils } from '@shared/utils/form-utils';
import { GalleryApi } from '@core/services/gallery-api';
import { StatusesApi } from '@core/services/statuses-api';
import { BadgesInput } from "../badges-input/badges-input";
import { ToastMessage } from '@shared/services/toast-message';
import { fileRequired } from '@shared/validators/file-required';
import { AppError } from '@core/interfaces/app-error.interface';
import { GenerateContent } from '@shared/utils/generate-content';
import { fileValidator } from '@shared/validators/file-validator';
import { ImageRequest } from '@admin/interfaces/image-request.interface';
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';

@Component({
  selector: 'admin-image-form',
  imports: [ReactiveFormsModule, TitleCasePipe, BadgesInput],
  templateUrl: './admin-image-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminImageForm implements AfterViewInit {
    // Init
  private generateContent = GenerateContent;
  protected isLoading = signal(false);
  private isError = signal<string | null>(null);
  private isSuccess = signal<string | null>(null);
  protected statuses = signal<StatusResponse[]>([]);
  protected imageResponseData = signal<ImageResponse | undefined>(undefined);

  // Injections
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastMessage);
  private imagesApiService = inject(GalleryApi);
  private statusesApiService = inject(StatusesApi);

  // Input signal
  public imageToUpdate = input<ImageResponse>();

  // AfterViewInit
  ngAfterViewInit(): void {
    this.statusesService();
  }

  constructor() {
    effect(() => {
      const data = this.imageToUpdate();

      if (!data) {
        // CREATE
        this.setCreateMode();
        return;
      }

      // EDIT
      this.setEditMode(data);
    });
  }

  // Image form
  protected imagesForm: FormGroup = this.formBuilder.group({
    file: [null, [fileRequired, fileValidator({
      maxSizeMb: 5,
      allowedExtensions: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/jfif', 'video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm']
     })]],
    categories: [[], [
      (control: any) => {
        const value = control.value;
        if(!value || value.length === 0) {
          return { required: true };
        }

        return null;
      }
    ]],
    statusId: ['', [Validators.required]],
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5000)]],
  });

  // OnSubmit form
  protected onImageForm() {
    if (this.imagesForm.invalid) {
      this.imagesForm.markAllAsTouched();
      return;
    }

    this.imagesService(this.imagesForm.value, this.imageToUpdate()?.id);
  }

  // Get statuses
  private statusesService() {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.statusesApiService.getStatuses()
      .subscribe({
        next: (value: StatusResponse[]) => {
          this.statuses.set(value);
          this.isLoading.set(false);
        },
        error: (_) => {
          this.isLoading.set(false);
        }
      })
  }

  // Calling create or edit new API
  protected imagesService(imageRequest: ImageRequest, id: string | undefined = undefined): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.imagesApiService.createOrEditImage(imageRequest, id)
      .subscribe({
        next: (value: ImageResponse) => {
          this.imageResponseData.set(value);
          this.isLoading.set(false);
          this.isSuccess.set(`Imagen ${this.imageToUpdate() ? 'actualizada' : 'creada'} exitosamente.`);
          this.imagesForm.reset();

          this.router.navigate(['/admin/imagenes']);
        },
        error: (error: AppError) => {
          this.isLoading.set(false);
          this.isError.set(error.message);
        }
      });
  }

  // Set form
  private setCreateMode() {
    this.imagesForm.reset();

    this.imagesForm.get('file')?.setValidators([
      fileRequired,
      fileValidator({
        maxSizeMb: 5,
        allowedExtensions: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/jfif', 'video/mp4', 'video/quicktime', 'video/x-matroska', 'video/webm']
      })
    ]);

    this.imagesForm.get('file')?.updateValueAndValidity();
    this.imagePreview.set(this.defaultImage);
  }

  private setEditMode(data: ImageResponse) {
    this.imagesForm.patchValue({
      title: data.title,
      statusId: data.statusId,
      categories: this.mapCategories(data.categories),
      description: data.description,
    });

    this.imagesForm.get('file')?.clearValidators();
    this.imagesForm.get('file')?.updateValueAndValidity();

    this.imagePreview.set(this.generateContent.url(data.filePath) ?? this.defaultImage);
  }

  private mapCategories(categories: string[]) {
    return categories.map(name => ({
      id: null,
      name
    }));
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

  // Image preview
  protected defaultImage = '/placeholders/image-placeholder.svg';
  protected imagePreview = signal<string>(this.defaultImage);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length <= 0) return;

    const file = input.files[0];

    this.imagesForm.patchValue({
      file: file
    });

    this.imagesForm.get('file')?.markAsDirty();
    this.imagesForm.get('file')?.markAsTouched();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  removeImage(input: HTMLInputElement) {
    this.imagesForm.get('file')?.reset();

    input.value = '';

    this.imagePreview.set(this.defaultImage);
  }
}
