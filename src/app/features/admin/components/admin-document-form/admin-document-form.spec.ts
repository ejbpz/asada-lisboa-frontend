import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { StatusesApi } from '@core/services/statuses-api';
import { AdminDocumentForm } from './admin-document-form';
import { DocumentsApi } from '@core/services/documents-api';
import { ToastMessage } from '@shared/services/toast-message';

describe('AdminDocumentForm', () => {
  let fixture: ComponentFixture<AdminDocumentForm>;
  let component: AdminDocumentForm;

  let router: jasmine.SpyObj<Router>;
  let toast: jasmine.SpyObj<ToastMessage>;
  let documentsApi: jasmine.SpyObj<DocumentsApi>;
  let statusesApi: jasmine.SpyObj<StatusesApi>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    toast = jasmine.createSpyObj('ToastMessage', [
      'success',
      'error'
    ]);

    documentsApi = jasmine.createSpyObj('DocumentsApi', [
      'createOrEditDocument'
    ]);

    statusesApi = jasmine.createSpyObj('StatusesApi', [
      'getStatuses'
    ]);

    statusesApi.getStatuses.and.returnValue(
      of([
        {
          id: '1',
          name: 'activo'
        }
      ])
    );

    await TestBed.configureTestingModule({
      imports: [AdminDocumentForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FormBuilder,
        { provide: Router, useValue: router },
        { provide: ToastMessage, useValue: toast },
        { provide: DocumentsApi, useValue: documentsApi },
        { provide: StatusesApi, useValue: statusesApi }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDocumentForm);
    component = fixture.componentInstance;

    // mock input signal
    (component as any).documentToUpdate = () => undefined;

    fixture.detectChanges();
  });

  function createFile(): File {
    return new File(
      ['dummy content'],
      'test.pdf',
      {
        type: 'application/pdf'
      }
    );
  }

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load statuses on init', () => {
    expect(statusesApi.getStatuses).toHaveBeenCalled();

    expect(component.statuses().length).toBe(1);
  });

  it('should mark form as touched when invalid', () => {
    component.onDocumentForm();

    expect(component.documentForm.touched).toBeTrue();
    expect(documentsApi.createOrEditDocument).not.toHaveBeenCalled();
  });

  it('should submit valid form successfully', () => {
    documentsApi.createOrEditDocument.and.returnValue(
      of({
        id: '1',
        title: 'Documento',
        description: 'Descripción',
        categories: ['General'],
        filePath: 'path',
        fileSize: 1000,
        documentTypeName: 'PDF',
        statusId: '1'
      } as any)
    );

    component.documentForm.patchValue({
      file: createFile(),
      categories: [{ id: null, name: 'General' }],
      statusId: '1',
      title: 'Documento',
      description: 'Descripción'
    });

    component.onDocumentForm();

    expect(documentsApi.createOrEditDocument).toHaveBeenCalled();

    expect(toast.success).toHaveBeenCalledWith(
      'Documento creado exitosamente.'
    );

    expect(router.navigate).toHaveBeenCalledWith([
      '/admin/documentos'
    ]);
  });

  it('should handle API error on submit', () => {
    documentsApi.createOrEditDocument.and.returnValue(
      throwError(() => ({
        message: 'Error API'
      }))
    );

    component.documentForm.patchValue({
      file: createFile(),
      categories: [{ id: null, name: 'General' }],
      statusId: '1',
      title: 'Documento',
      description: 'Descripción'
    });

    component.onDocumentForm();

    expect(toast.error).toHaveBeenCalledWith(
      'Error API'
    );
  });

  it('should not submit when loading is true', () => {
    component.isLoading.set(true);

    component.documentForm.patchValue({
      file: createFile(),
      categories: [{ id: null, name: 'General' }],
      statusId: '1',
      title: 'Documento',
      description: 'Descripción'
    });

    component.onDocumentForm();

    expect(documentsApi.createOrEditDocument).not.toHaveBeenCalled();
  });

  it('should set document info when file selected', () => {
    const file = createFile();

    const event = {
      target: {
        files: [file]
      }
    } as any;

    spyOn(URL, 'createObjectURL').and.returnValue('blob:test');

    component.onDocumentSelected(event);

    expect(component.documentForm.get('file')?.value).toBe(file);

    expect(component.documentInfo()).toEqual({
      name: 'test.pdf',
      size: jasmine.any(Number),
      type: 'application/pdf',
      url: 'blob:test'
    });
  });

  it('should remove selected document', () => {
    const input = document.createElement('input');

    component.documentInfo.set({
      name: 'test.pdf',
      size: 1,
      type: 'application/pdf',
      url: 'blob:test'
    });

    spyOn(URL, 'revokeObjectURL');

    component.removeDocument(input);

    expect(component.documentInfo()).toBeNull();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith(
      'blob:test'
    );
  });

  it('should open document in new tab', () => {
    spyOn(window, 'open');

    component.documentInfo.set({
      name: 'test.pdf',
      size: 1,
      type: 'application/pdf',
      url: 'blob:test'
    });

    component.openDocument();

    expect(window.open).toHaveBeenCalledWith(
      'blob:test',
      '_blank'
    );
  });

  it('should trigger file input click', () => {
    const input = document.createElement('input');

    spyOn(input, 'click');

    component.triggerFileInput(input);

    expect(input.click).toHaveBeenCalled();
  });

  it('should patch form in edit mode', () => {
    (component as any).documentToUpdate = () => ({
      id: '1',
      title: 'Documento editado',
      description: 'Descripción editada',
      categories: ['General'],
      filePath: 'path',
      fileSize: 1048576,
      documentTypeName: 'PDF',
      statusId: '1'
    });

    fixture = TestBed.createComponent(AdminDocumentForm);
    component = fixture.componentInstance;

    (component as any).documentToUpdate = () => ({
      id: '1',
      title: 'Documento editado',
      description: 'Descripción editada',
      categories: ['General'],
      filePath: 'path',
      fileSize: 1048576,
      documentTypeName: 'PDF',
      statusId: '1'
    });

    fixture.detectChanges();

    expect(component.documentForm.get('title')?.value)
      .toBe('Documento editado');

    expect(component.documentInfo()).toBeTruthy();
  });
});
