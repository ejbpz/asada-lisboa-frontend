import { Component, input } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminImageForm } from './admin-image-form';
import { GalleryApi } from '@core/services/gallery-api';
import { StatusesApi } from '@core/services/statuses-api';
import { ToastMessage } from '@shared/services/toast-message';
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

@Component({
  selector: 'badges-input',
  standalone: true,
  template: ''
})
class MockBadgesInput {
  value = input<any>();
}

describe('AdminImageForm', () => {
  let component: AdminImageForm;
  let fixture: ComponentFixture<AdminImageForm>;

  let api: jasmine.SpyObj<GalleryApi>;
  let statusesApi: jasmine.SpyObj<StatusesApi>;
  let toast: jasmine.SpyObj<ToastMessage>;
  let router: Router;

  const statusesMock = [
    {
      id: '1',
      name: 'active'
    }
  ];

  const imageMock: ImageResponse = {
    id: '1',
    title: 'Imagen test',
    description: 'Descripción test',
    statusId: '1',
    filePath: 'imagenes/test.webp',
    categories: ['Categoría'],
    fileSize: 1000,
    fileName: 'test.webp',
    publicationDate: new Date(),
    slug: 'test-1.webp',
    statusName: 'Publicado',
    url: '/imagenes/test.webp'
  };

  beforeEach(async () => {
    api = jasmine.createSpyObj('GalleryApi', [
      'createOrEditImage'
    ]);

    statusesApi = jasmine.createSpyObj('StatusesApi', [
      'getStatuses'
    ]);

    toast = jasmine.createSpyObj('ToastMessage', [
      'success',
      'error'
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminImageForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: GalleryApi, useValue: api },
        { provide: StatusesApi, useValue: statusesApi },
        { provide: ToastMessage, useValue: toast },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminImageForm);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);

    spyOn(router, 'navigate');

    statusesApi.getStatuses.and.returnValue(of(statusesMock));

    fixture.detectChanges();
  });

  describe('Component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load statuses on init', () => {
      expect(statusesApi.getStatuses).toHaveBeenCalled();
      expect(component['statuses']()).toEqual(statusesMock);
    });

    it('should initialize with default image', () => {
      expect(component['imagePreview']()).toBe(
        component['defaultImage']
      );
    });
  });

  describe('Form validation', () => {
    it('should mark form as touched if invalid', () => {
      component.onImageForm();

      expect(component.imagesForm.touched).toBeTrue();
      expect(api.createOrEditImage).not.toHaveBeenCalled();
    });

    it('should validate required fields', () => {
      const form = component.imagesForm;

      expect(form.valid).toBeFalse();

      expect(form.get('title')?.hasError('required')).toBeTrue();
      expect(form.get('description')?.hasError('required')).toBeTrue();
      expect(form.get('statusId')?.hasError('required')).toBeTrue();
    });
  });

  describe('Create image', () => {
    beforeEach(() => {
      const file = new File(
        ['test'],
        'test.webp',
        { type: 'image/webp' }
      );

      component.imagesForm.patchValue({
        file,
        categories: [{ id: null, name: 'Categoría' }],
        statusId: '1',
        title: 'Imagen test',
        description: 'Descripción test'
      });
    });

    it('should create image successfully', () => {
      api.createOrEditImage.and.returnValue(
        of(imageMock)
      );

      component.onImageForm();

      expect(api.createOrEditImage).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith([
        '/admin/imagenes'
      ]);
    });

    it('should show error toast when API fails', () => {
      api.createOrEditImage.and.returnValue(
        throwError(() => ({
          message: 'Error API'
        }))
      );

      component.onImageForm();

      expect(toast.error).toHaveBeenCalledWith(
        'Error API'
      );
    });

    it('should not call service if isLoading is true', () => {
      component['isLoading'].set(true);

      component.onImageForm();

      expect(api.createOrEditImage).not.toHaveBeenCalled();
    });
  });

  describe('Statuses service', () => {
    it('should handle statuses API error', () => {
      statusesApi.getStatuses.and.returnValue(
        throwError(() => new Error())
      );

      component['statusesService']();

      expect(component['isLoading']()).toBeFalse();
    });

    it('should not call statuses service if loading', () => {
      component['isLoading'].set(true);

      component['statusesService']();

      expect(statusesApi.getStatuses).toHaveBeenCalledTimes(1);
    });
  });

  describe('File handling', () => {
    it('should update form and preview on file selected', () => {
      const file = new File(
        ['test'],
        'image.webp',
        { type: 'image/webp' }
      );

      const event = {
        target: {
          files: [file]
        }
      } as any;

      const readerSpy = jasmine.createSpyObj(
        'FileReader',
        ['readAsDataURL'],
        {
          result: 'base64-image'
        }
      );

      spyOn(window as any, 'FileReader')
        .and.returnValue(readerSpy);

      component.onFileSelected(event);

      readerSpy.onload();

      expect(
        component.imagesForm.get('file')?.value
      ).toEqual(file);

      expect(component['imagePreview']())
        .toBe('base64-image');
    });

    it('should return if no file selected', () => {
      const event = {
        target: {
          files: []
        }
      } as any;

      component.onFileSelected(event);

      expect(
        component.imagesForm.get('file')?.value
      ).toBeNull();
    });

    it('should trigger file input click', () => {
      const input = document.createElement('input');

      spyOn(input, 'click');

      component.triggerFileInput(input);

      expect(input.click).toHaveBeenCalled();
    });

    it('should remove image and reset preview', () => {
      const input = document.createElement('input');

      component['imagePreview'].set('preview-image');

      component.imagesForm.patchValue({
        file: new File(['x'], 'x.webp')
      });

      component.removeImage(input);

      expect(
        component.imagesForm.get('file')?.value
      ).toBeNull();

      expect(component['imagePreview']())
        .toBe(component['defaultImage']);
    });
  });

  describe('Edit mode', () => {
    it('should patch form when editing image', () => {
      fixture.componentRef.setInput(
        'imageToUpdate',
        imageMock
      );

      fixture.detectChanges();

      expect(
        component.imagesForm.get('title')?.value
      ).toBe(imageMock.title);

      expect(
        component.imagesForm.get('description')?.value
      ).toBe(imageMock.description);

      expect(
        component.imagesForm.get('statusId')?.value
      ).toBe(imageMock.statusId);
    });

    it('should clear file validators in edit mode', () => {
      fixture.componentRef.setInput(
        'imageToUpdate',
        imageMock
      );

      fixture.detectChanges();

      const control = component.imagesForm.get('file');

      control?.setValue(null);
      control?.updateValueAndValidity();

      expect(control?.errors).toBeNull();
    });
  });

  describe('Helpers', () => {
    it('should map categories correctly', () => {
      const result = component['mapCategories']([
        'A',
        'B'
      ]);

      expect(result).toEqual([
        {
          id: null,
          name: 'A'
        },
        {
          id: null,
          name: 'B'
        }
      ]);
    });

    it('should return form errors', () => {
      const result = component.getErrors({
        required: true
      });

      expect(result).toBeTruthy();
    });
  });
});
