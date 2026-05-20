import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { AngularEditorConfig, UploadResponse, AngularEditorModule } from '@kolkov/angular-editor';
import { NewsApi } from '@core/services/news-api';
import { FormUtils } from '@shared/utils/form-utils';
import { StatusesApi } from '@core/services/statuses-api';
import { BadgesInput } from "../badges-input/badges-input";
import { ToastMessage } from '@shared/services/toast-message';
import { RichEditorApi } from '@core/services/rich-editor-api';
import { fileRequired } from '@shared/validators/file-required';
import { AppError } from '@core/interfaces/app-error.interface';
import { GenerateContent } from '@shared/utils/generate-content';
import { fileValidator } from '@shared/validators/file-validator';
import { environment } from '@environments/environment.development';
import { NewRequest } from '@admin/interfaces/new-request.interface';
import { NewResponse } from '@shared/interfaces/new-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';
import { EditorResponse } from '@admin/interfaces/editor-response.interface';

@Component({
  selector: 'admin-new-form',
  imports: [AngularEditorModule, ReactiveFormsModule, TitleCasePipe, BadgesInput],
  templateUrl: './admin-new-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNewForm implements AfterViewInit {
  // Init
  private env = environment;
  private generateContent = GenerateContent;
  protected isLoading = signal(false);
  protected statuses = signal<StatusResponse[]>([]);
  protected newResponseData = signal<NewResponse | undefined>(undefined);

  // Injections
  private router = inject(Router);
  private toast = inject(ToastMessage);
  private newsApiService = inject(NewsApi);
  private formBuilder = inject(FormBuilder);
  private richEditorApi = inject(RichEditorApi);
  private statusesApiService = inject(StatusesApi);

  // Input signal
  public newToUpdate = input<NewResponse>();

  // AfterViewInit
  ngAfterViewInit(): void {
    this.statusesService();
  }

  constructor() {
    effect(() => {
      const data = this.newToUpdate();

      if (!data) {
        // CREATE
        this.setCreateMode();
        return;
      }

      // EDIT
      this.setEditMode(data);
    });
  }

  // New form
  protected newsForm: FormGroup = this.formBuilder.group({
    file: [null, [fileRequired, fileValidator({
      maxSizeMb: 5,
      allowedExtensions: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/jfif']
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
  protected onNewForm() {
    if (this.newsForm.invalid) {
      this.newsForm.markAllAsTouched();
      return;
    }

    this.newsService(this.newsForm.value, this.newToUpdate()?.id);
  }

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

    this.newsForm.patchValue({
      file: file
    });

    this.newsForm.get('file')?.markAsDirty();
    this.newsForm.get('file')?.markAsTouched();

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
    this.newsForm.get('file')?.reset();

    input.value = '';

    this.imagePreview.set(this.defaultImage);
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
  protected newsService(newRequest: NewRequest, id: string | undefined = undefined): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.newsApiService.createOrEditNew(newRequest, id)
      .subscribe({
        next: (value: NewResponse) => {
          this.newResponseData.set(value);
          this.isLoading.set(false);
          this.toast.success(`Noticia ${this.newToUpdate() ? 'actualizada' : 'creada'} exitosamente.`);
          this.newsForm.reset();

          this.router.navigate(['/admin/noticias']);
        },
        error: (error: AppError) => {
          this.isLoading.set(false);
          this.toast.error(error.message);
        }
      });
  }

  // Set form
  private setCreateMode() {
    this.newsForm.reset();

    this.newsForm.get('file')?.setValidators([
      fileRequired,
      fileValidator({
        maxSizeMb: 5,
        allowedExtensions: ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/jfif']
      })
    ]);

    this.newsForm.get('file')?.updateValueAndValidity();
    this.imagePreview.set(this.defaultImage);
  }

  private setEditMode(data: NewResponse) {
    this.newsForm.patchValue({
      title: data.title,
      statusId: data.statusId,
      categories: this.mapCategories(data.categories),
      description: data.description,
    });

    this.newsForm.get('file')?.clearValidators();
    this.newsForm.get('file')?.updateValueAndValidity();

    this.imagePreview.set(this.generateContent.url(data.imageUrl) ?? this.defaultImage);
  }

  private mapCategories(categories: string[]) {
    return categories.map(name => ({
      id: null,
      name
    }));
  }

  // Editor configuration
  public config: AngularEditorConfig = {
    editable: true,
    sanitize: true,
    spellcheck: true,
    height: '350px',
    maxHeight: 'auto',
    minHeight: '250px',
    showToolbar: true,
    enableToolbar: true,
    toolbarPosition: 'top',
    defaultParagraphSeparator: 'p',
    placeholder: 'Escriba el contenido de la noticia aquí...',
    toolbarHiddenButtons: [
      [
        'heading',
        'fontName',
        'fontSize',
        'textColor',
        'insertVideo',
        'removeFormat',
        'backgroundColor',
        'toggleEditorMode',
        'insertHorizontalRule',
      ]
    ],
    customClasses: [
      { class: 'text-[1.5rem] font-bold font-hepta-slab', name: 'Título 2', tag: 'h2' },
      { class: 'text-[1.3rem] font-normal font-hepta-slab', name: 'Título 3', tag: 'h3' },
      { class: 'text-[1.1rem] font-normal font-hepta-slab', name: 'Título 4', tag: 'h4' },
      { class: 'text-[1.08rem] font-normal font-hepta-slab', name: 'Título 5', tag: 'h5' },
      { class: 'text-[1.05rem] font-normal font-hepta-slab', name: 'Título 6', tag: 'h6' },
      { class: 'text-[1rem] font-light font-poppins', name: 'Párrafo', tag: 'p' },
      { class: 'text-[#737373] text-[0.85rem] font-light font-poppins', name: 'Detalle', tag: 'span' },
    ],
    upload: (file: File): Observable<HttpEvent<UploadResponse>> => {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/jfif'];

      if (!allowedTypes.includes(file.type)) {
        this.toast.error('Tipo de imagen no permitida');
      }

      if (file.size > 5_242_880) {
        this.toast.error('Imágenes máximo 5MB');
      }

      try {
        return this.richEditorApi.uploadTemporalImage(file)
          .pipe(
            filter((event): event is HttpResponse<EditorResponse> =>
              event.type === HttpEventType.Response
            ),
            map((event: HttpEvent<EditorResponse>) => {
              if(event.type === HttpEventType.Response) {

                return new HttpResponse<UploadResponse> ({
                  body: {
                    imageUrl: `${this.env.API_URL_CONTENT}${event.body?.url ?? ''}`
                  },
                  status: event.status,
                  headers: event.headers,
                  url: event.url ?? undefined,
                  statusText: event.statusText,
                });
              }

              return event as HttpEvent<UploadResponse>;
            })
          );

      } catch (error) {
        this.toast.error('Error inesperado al subir la imagen del contenido');
        throw error;
      }
    }
  }
}
