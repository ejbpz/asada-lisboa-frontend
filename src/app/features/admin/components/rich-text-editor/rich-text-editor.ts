import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, forwardRef, inject, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AngularEditorConfig, AngularEditorModule, UploadResponse } from '@kolkov/angular-editor';
import { RichEditorApi } from '@core/services/rich-editor-api';
import { EditorResponse } from '@admin/interfaces/editor-response.interface';
import { environment } from '@environments/environment.development';

@Component({
  selector: 'rich-text-editor',
  imports: [AngularEditorModule, FormsModule],
  templateUrl: './rich-text-editor.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditor),
      multi: true,
    }
  ]
})
export class RichTextEditor implements ControlValueAccessor {
  // Init
  private env = environment;
  protected value = signal<string>('');

  // Injections
  private richEditorApi = inject(RichEditorApi);

  // Editor configuration
  protected config: AngularEditorConfig = {
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
        'fontSize',
        'textColor',
        'insertVideo',
        'removeFormat',
        'customClasses',
        'backgroundColor',
        'toggleEditorMode',
        'insertHorizontalRule',
      ]
    ],
    fonts: [
      {class: 'font-poppins', name: 'Poppins'},
      {class: 'font-hepta-slab', name: 'Hepta Slab'},
    ],
    upload: (file: File): Observable<HttpEvent<UploadResponse>> => {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp', 'image/jfif'];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de imagen no permitida');
      }

      if (file.size > 5_000_000) {
        throw new Error('Imágenes máximo 5MB');
      }

      try {
        return this.richEditorApi.uploadTemporalImage(file)
          .pipe(
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
        console.error(error);
        throw error;
      }
    }
  }

  // ControlValueAccessor methods
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected handleChange(value: string) {
    this.value.set(value);
    this.onChange(value);
  }

  protected handleBlur() {
    this.onTouched();
  }
}
