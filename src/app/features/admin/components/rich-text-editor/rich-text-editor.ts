import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, forwardRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter, map, Observable } from 'rxjs';
import { AngularEditorConfig, AngularEditorModule, UploadResponse } from '@kolkov/angular-editor';
import { RichEditorApi } from '@core/services/rich-editor-api';
import { environment } from '@environments/environment.development';
import { EditorResponse } from '@admin/interfaces/editor-response.interface';

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
        throw new Error('Tipo de imagen no permitida');
      }

      if (file.size > 5_000_000) {
        throw new Error('Imágenes máximo 5MB');
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
        console.error(error);
        throw error;
      }
    }
  }

  // ControlValueAccessor
  protected value = '';
  protected isDisabled = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  handleChange(value: string) {
    this.value = value;
    this.onChange(value);
  }

  handleBlur() {
    this.onTouched();
  }
}
