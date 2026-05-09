import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormUtils } from '@shared/utils/form-utils';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusesApi } from '@core/services/statuses-api';
import { BadgesInput } from "../badges-input/badges-input";
import { DocumentsApi } from '@core/services/documents-api';
import { ToastMessage } from '@shared/services/toast-message';
import { fileRequired } from '@shared/validators/file-required';
import { GenerateContent } from '@shared/utils/generate-content';
import { fileValidator } from '@shared/validators/file-validator';
import { StatusResponse } from '@admin/interfaces/status-response.interface';
import { DocumentRequest } from '@admin/interfaces/document-request.interface';
import { DocumentResponse } from '@admin/interfaces/document-response.interface';

@Component({
  selector: 'admin-document-form',
  imports: [ReactiveFormsModule, BadgesInput, TitleCasePipe],
  templateUrl: './admin-document-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDocumentForm implements AfterViewInit {
  // Init
  protected isLoading = signal<boolean>(false);
  protected isError = signal<string | null>(null);
  protected isSuccess = signal<string | null>(null);
  protected statuses = signal<StatusResponse[]>([]);
  protected newResponseData = signal<DocumentResponse | undefined>(undefined);

  // Input signal
  public documentToUpdate = input<DocumentResponse>();

  // Injections
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastMessage);
  private documentsApi = inject(DocumentsApi);
  private statusesApiService = inject(StatusesApi);

  // Document form
  protected documentForm: FormGroup = this.formBuilder.group({
    file: [null, [fileRequired, fileValidator({
      maxSizeMb: 15,
      allowedExtensions: ['application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/msword',
        'text/csv',
        'text/plain',
        'application/octet-stream']
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
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
  });

    // AfterViewInit
  ngAfterViewInit(): void {
    this.statusesService();
  }

  constructor() {
    effect(() => {
      const data = this.documentToUpdate();

      if (!data) {
        // CREATE
        this.setCreateMode();
        return;
      }

      // EDIT
      this.setEditMode(data);
    });
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

  // On form submit
  protected onDocumentForm() {
    if (this.documentForm.invalid) {
      this.documentForm.markAllAsTouched();
      return;
    }

    this.newsService(this.documentForm.value, this.documentToUpdate()?.id);
  }

  // Calling create or edit document API
  protected newsService(documentRequest: DocumentRequest, id: string | undefined = undefined): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);
    this.isError.set(null);

    this.documentsApi.createOrEditDocument(documentRequest, id)
      .subscribe({
        next: (value: DocumentResponse) => {
          this.newResponseData.set(value);
          this.isLoading.set(false);
          this.isSuccess.set(`Documento ${this.documentToUpdate() ? 'actualizado' : 'creado'} exitosamente.`);
          this.documentForm.reset();

          this.router.navigate(['/admin/documentos']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.isError.set(error.message);
        }
      });
  }

  // Get input errors
  protected getErrors(errors: ValidationErrors): string | undefined | null {
    return FormUtils.getErrors(errors);
  }

  // Toast error
  private showToast = effect(() => {
    this.toastService.showToast(
      this.isError() ? this.isError() : this.isSuccess(),
      this.isError() ? '❌' : '✔'
    );

    this.isError.set(null);
  });

  // Set form
  private setCreateMode() {
    this.documentForm.reset();

    this.documentForm.get('file')?.setValidators([
      fileRequired,
      fileValidator({
        maxSizeMb: 15,
        allowedExtensions: ['application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'application/msword',
          'text/csv',
          'text/plain',
          'application/octet-stream']
      })
    ]);

    this.documentForm.get('file')?.updateValueAndValidity();
  }

  private setEditMode(data: DocumentResponse) {
    this.documentForm.patchValue({
      title: data.title,
      statusId: data.statusId,
      categories: this.mapCategories(data.categories),
      description: data.description,
    });

    this.documentForm.get('file')?.clearValidators();
    this.documentForm.get('file')?.updateValueAndValidity();

    this.documentInfo.set({
      name: data.title,
      size: +(+data.fileSize / 1024 / 1024).toFixed(2),
      type: data.documentTypeName,
      url: GenerateContent.url(data.filePath)
    });
  }

  private mapCategories(categories: string[]) {
    return categories.map(name => ({
      id: null,
      name
    }));
  }

  // Document preview
  protected documentInfo = signal<{
    name: string;
    size: number;
    type: string;
    url?: string;
  } | null>(null);

  onDocumentSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    this.documentForm.patchValue({
      file: file
    });

    this.documentForm.get('file')?.markAsDirty();
    this.documentForm.get('file')?.markAsTouched();

    const url = URL.createObjectURL(file);

    this.documentInfo.set({
      name: file.name,
      size: +(file.size / 1024 / 1024).toFixed(2),
      type: file.type,
      url
    });
  }

  openDocument() {
    const doc = this.documentInfo();
    if (!doc?.url) return;

    window.open(doc.url, '_blank');
  }

  removeDocument(input: HTMLInputElement) {
    const current = this.documentInfo();

    if (current?.url) {
      URL.revokeObjectURL(current.url);
    }

    this.documentForm.get('file')?.reset();
    input.value = '';
    this.documentInfo.set(null);
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }
}
