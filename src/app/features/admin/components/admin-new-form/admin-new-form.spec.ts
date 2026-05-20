import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Component, forwardRef, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpEventType, HttpHeaders, HttpResponse, provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AdminNewForm } from './admin-new-form';
import { NewsApi } from '@core/services/news-api';
import { StatusesApi } from '@core/services/statuses-api';
import { BadgesInput } from '../badges-input/badges-input';
import { ToastMessage } from '@shared/services/toast-message';
import { RichEditorApi } from '@core/services/rich-editor-api';
import { AppError } from '@core/interfaces/app-error.interface';
import { NewRequest } from '@admin/interfaces/new-request.interface';
import { NewResponse } from '@shared/interfaces/new-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';
import { EditorResponse } from '@admin/interfaces/editor-response.interface';
import { provideHttpClientTesting } from '@angular/common/http/testing';

@Component({
  selector: 'badges-input',
  standalone: true,
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockBadgesInputComponent),
      multi: true
    }
  ]
})
class MockBadgesInputComponent implements ControlValueAccessor {
  value = input<any>();

  writeValue(): void {}
  registerOnChange(): void {}
  registerOnTouched(): void {}
  setDisabledState?(): void {}
}

describe('AdminNewForm', () => {
  let component: AdminNewForm;
  let fixture: ComponentFixture<AdminNewForm>;

  let routerSpy: jasmine.SpyObj<Router>;
  let newsApiSpy: jasmine.SpyObj<NewsApi>;
  let statusesApiSpy: jasmine.SpyObj<StatusesApi>;
  let toastSpy: jasmine.SpyObj<ToastMessage>;
  let richEditorApiSpy: jasmine.SpyObj<RichEditorApi>;

  const mockStatuses: StatusResponse[] = [
    {
      id: '1',
      name: 'published'
    } as StatusResponse
  ];

  const mockNewResponse: NewResponse = {
    id: '1',
    title: 'Test title',
    description: 'Test description',
    imageUrl: '/image.jpg',
    statusId: '1',
    categories: ['news']
  } as NewResponse;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    newsApiSpy = jasmine.createSpyObj('NewsApi', [
      'createOrEditNew'
    ]);

    statusesApiSpy = jasmine.createSpyObj('StatusesApi', [
      'getStatuses'
    ]);

    toastSpy = jasmine.createSpyObj('ToastMessage', [
      'success',
      'error'
    ]);

    richEditorApiSpy = jasmine.createSpyObj('RichEditorApi', [
      'uploadTemporalImage'
    ]);

    statusesApiSpy.getStatuses.and.returnValue(of(mockStatuses));

    await TestBed.configureTestingModule({
      imports: [
        AdminNewForm,
        MockBadgesInputComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: NewsApi,
          useValue: newsApiSpy
        },
        {
          provide: StatusesApi,
          useValue: statusesApiSpy
        },
        {
          provide: ToastMessage,
          useValue: toastSpy
        },
        {
          provide: RichEditorApi,
          useValue: richEditorApiSpy
        }
      ],
    })
    .overrideComponent(AdminNewForm, {
      remove: {
        imports: [BadgesInput]
      },
      add: {
        imports: [MockBadgesInputComponent]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewForm);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default image', () => {
      expect(component['imagePreview']())
        .toBe('/placeholders/image-placeholder.svg');
    });

    it('should load statuses on init', () => {
      component.ngAfterViewInit();

      expect(statusesApiSpy.getStatuses).toHaveBeenCalled();

      expect(component['statuses']()).toEqual(mockStatuses);
    });
  });

  describe('Form validation', () => {
    it('should validate required fields', () => {
      const form = component['newsForm'];

      expect(form.invalid).toBeTrue();

      expect(form.get('file')?.errors?.['required']).toBeTruthy();

      expect(form.get('title')?.errors?.['required']).toBeTruthy();

      expect(form.get('description')?.errors?.['required']).toBeTruthy();

      expect(form.get('statusId')?.errors?.['required']).toBeTruthy();

      expect(form.get('categories')?.errors?.['required']).toBeTruthy();
    });

    it('should mark form as touched if invalid', () => {
      spyOn(component['newsForm'], 'markAllAsTouched');

      component['onNewForm']();

      expect(component['newsForm'].markAllAsTouched)
        .toHaveBeenCalled();
    });
  });

  describe('Create new', () => {
    beforeEach(() => {
      component['newsForm'].patchValue({
        file: new File(['test'], 'test.jpg', {
          type: 'image/jpeg'
        }),
        title: 'Test title',
        description: 'Test description',
        statusId: '1',
        categories: [{ id: null, name: 'news' }]
      });
    });

    it('should create new successfully', () => {
      newsApiSpy.createOrEditNew
        .and.returnValue(of(mockNewResponse));

      component['onNewForm']();

      expect(newsApiSpy.createOrEditNew)
        .toHaveBeenCalled();

      expect(component['newResponseData']())
        .toEqual(mockNewResponse);

      expect(toastSpy.success)
        .toHaveBeenCalledWith(
          'Noticia creada exitosamente.'
        );

      expect(routerSpy.navigate)
        .toHaveBeenCalledWith(['/admin/noticias']);

      expect(component['isLoading']()).toBeFalse();
    });

    it('should show error toast when API fails', () => {
      const mockError: AppError = {
        message: 'Error creating new'
      } as AppError;

      newsApiSpy.createOrEditNew
        .and.returnValue(
          throwError(() => mockError)
        );

      component['onNewForm']();

      expect(newsApiSpy.createOrEditNew)
        .toHaveBeenCalled();

      expect(toastSpy.error)
        .toHaveBeenCalledWith(
          'Error creating new'
        );

      expect(component['isLoading']()).toBeFalse();
    });

    it('should not call service if isLoading is true', () => {
      component['isLoading'].set(true);

      component['newsService']({} as NewRequest);

      expect(newsApiSpy.createOrEditNew)
        .not.toHaveBeenCalled();
    });
  });

  describe('Statuses service', () => {
    it('should not call statuses service if loading', () => {
      component['isLoading'].set(true);

      component['statusesService']();

      expect(statusesApiSpy.getStatuses)
        .toHaveBeenCalledTimes(1);
    });

    it('should handle statuses API error', () => {
      statusesApiSpy.getStatuses.and.returnValue(
        throwError(() => new Error('API Error'))
      );

      component['isLoading'].set(false);

      component['statusesService']();

      expect(component['isLoading']()).toBeFalse();
    });
  });

  describe('Edit mode', () => {
    it('should patch form when editing new', () => {
      fixture.componentRef.setInput(
        'newToUpdate',
        mockNewResponse
      );

      fixture.detectChanges();

      expect(component['newsForm'].value.title)
        .toBe(mockNewResponse.title);

      expect(component['newsForm'].value.description)
        .toBe(mockNewResponse.description);

      expect(component['newsForm'].value.statusId)
        .toBe(mockNewResponse.statusId);

      expect(component['imagePreview']())
        .toContain(mockNewResponse.imageUrl);
    });

    it('should clear file validators in edit mode', () => {
      fixture.componentRef.setInput(
        'newToUpdate',
        mockNewResponse
      );

      fixture.detectChanges();

      component['newsForm'].get('file')
        ?.setValue(null);

      component['newsForm'].get('file')
        ?.updateValueAndValidity();

      expect(component['newsForm']
        .get('file')
        ?.errors)
        .toBeNull();
    });
  });

  describe('Helpers', () => {
    it('should map categories correctly', () => {
      const result = component['mapCategories']([
        'news',
        'events'
      ]);

      expect(result).toEqual([
        {
          id: null,
          name: 'news'
        },
        {
          id: null,
          name: 'events'
        }
      ]);
    });

    it('should return form errors', () => {
      const result = component['getErrors']({
        required: true
      });

      expect(result).toBeTruthy();
    });
  });

  describe('File handling', () => {
    it('should return if no file selected', () => {
      const event = {
        target: {
          files: null
        }
      } as unknown as Event;

      component.onFileSelected(event);

      expect(component['newsForm']
        .get('file')
        ?.value)
        .toBeNull();
    });

    it('should trigger file input click', () => {
      const input = document.createElement('input');

      spyOn(input, 'click');

      component.triggerFileInput(input);

      expect(input.click).toHaveBeenCalled();
    });

    it('should remove image and reset preview', () => {
      const input = document.createElement('input');

      input.value = 'test';

      component['imagePreview'].set('preview');

      component.removeImage(input);

      expect(component['newsForm']
        .get('file')
        ?.value)
        .toBeNull();

      expect(input.value).toBe('');

      expect(component['imagePreview']())
        .toBe(component['defaultImage']);
    });

    it('should update form and preview on file selected', () => {
      const file = new File(
        ['test'],
        'test.jpg',
        { type: 'image/jpeg' }
      );

      const mockFileReader = {
        result: 'data:image/jpeg;base64,test',
        readAsDataURL: jasmine.createSpy('readAsDataURL'),
        onload: null as ((this: FileReader, ev: ProgressEvent<FileReader>) => any) | null
      };

      spyOn(window as any, 'FileReader')
        .and.returnValue(mockFileReader);

      const event = {
        target: {
          files: [file]
        }
      } as unknown as Event;

      component.onFileSelected(event);

      if (mockFileReader.onload) {
        mockFileReader.onload.call(
          mockFileReader as any,
          {} as ProgressEvent<FileReader>
        );
      }

      expect(component['newsForm']
        .get('file')
        ?.value)
        .toEqual(file);

      expect(component['imagePreview']())
        .toContain('data:image/jpeg');
    });
  });

  describe('Editor upload', () => {
    it('should upload editor image successfully', (done) => {
      const file = new File(
        ['test'],
        'test.jpg',
        { type: 'image/jpeg' }
      );

      const response = new HttpResponse<EditorResponse>({
        body: {
          url: '/uploads/image.jpg'
        } as EditorResponse,
        status: 200,
        headers: new HttpHeaders()
      });

      richEditorApiSpy.uploadTemporalImage
        .and.returnValue(of(response));

      component.config.upload!(file)
        .subscribe(result => {

          if (result.type === HttpEventType.Response) {
            expect(result.body?.imageUrl)
              .toContain('/uploads/image.jpg');

            done();
          }
        });
    });

    it('should show error for invalid editor image type', () => {
      const file = new File(
        ['test'],
        'test.txt',
        { type: 'text/plain' }
      );

      richEditorApiSpy.uploadTemporalImage
        .and.returnValue(of());

      component.config.upload!(file);

      expect(toastSpy.error)
        .toHaveBeenCalledWith(
          'Tipo de imagen no permitida'
        );
    });

    it('should show error for image larger than 5MB', () => {
      const file = new File(
        [new ArrayBuffer(6_000_000)],
        'large.jpg',
        { type: 'image/jpeg' }
      );

      richEditorApiSpy.uploadTemporalImage
        .and.returnValue(of());

      component.config.upload!(file);

      expect(toastSpy.error)
        .toHaveBeenCalledWith(
          'Imágenes máximo 5MB'
        );
    });

    it('should throw and show toast on unexpected upload error', () => {
      const file = new File(
        ['test'],
        'test.jpg',
        { type: 'image/jpeg' }
      );

      richEditorApiSpy.uploadTemporalImage
        .and.throwError('Unexpected');

      expect(() => {
        component.config.upload!(file);
      }).toThrow();

      expect(toastSpy.error)
        .toHaveBeenCalledWith(
          'Error inesperado al subir la imagen del contenido'
        );
    });
  });

  describe('Template rendering', () => {
    it('should render statuses radios', () => {
      const radios = fixture.debugElement.queryAll(
        By.css('input[type="radio"]')
      );

      expect(radios.length).toBe(1);
    });

    it('should render submit button', () => {
      const button = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );

      expect(button).toBeTruthy();
    });
  });
});
