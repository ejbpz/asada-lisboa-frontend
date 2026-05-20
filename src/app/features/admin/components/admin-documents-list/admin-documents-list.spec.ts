import { provideRouter } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminDocumentsList } from './admin-documents-list';
import { DocumentsApi } from '@core/services/documents-api';
import { ToastMessage } from '@shared/services/toast-message';

describe('AdminDocumentsList', () => {
  let component: AdminDocumentsList;
  let fixture: ComponentFixture<AdminDocumentsList>;

  let api: jasmine.SpyObj<DocumentsApi>;
  let toast: jasmine.SpyObj<ToastMessage>;

  beforeEach(async () => {
    api = jasmine.createSpyObj('DocumentsApi', [
      'deleteDocument'
    ]);

    toast = jasmine.createSpyObj('ToastMessage', [
      'success',
      'error'
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminDocumentsList],
      providers: [
        provideRouter([]),
        {
          provide: DocumentsApi,
          useValue: api
        },
        {
          provide: ToastMessage,
          useValue: toast
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDocumentsList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('documents', [
      {
        id: '1',
        title: 'Documento 1',
        description: 'Descripción',
        filePath: 'file.pdf',
        fileSize: 1024,
        documentTypeName: 'PDF',
        categories: ['Legal'],
        statusId: '1'
      }
    ]);

    fixture.componentRef.setInput('statuses', [
      {
        id: '1',
        name: 'active'
      }
    ]);

    fixture.detectChanges();
  });

  function mockDialog() {
    const dialog = document.createElement('dialog');

    dialog.showModal = jasmine.createSpy('showModal');
    dialog.close = jasmine.createSpy('close');

    return dialog;
  }

  describe('Component initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize documentsData on ngOnInit', () => {
      component.ngOnInit();

      expect(component['documentsData']().length).toBe(1);
      expect(component['documentsData']()[0].id).toBe('1');
    });
  });

  describe('Delete modal', () => {
    it('should open delete modal and set selectedId', () => {
      const dialog = mockDialog();

      (component as any).modal = signal({
        nativeElement: dialog
      });

      component.openDeleteModal('123');

      expect(component['selectedId']()).toBe('123');
      expect(dialog.showModal).toHaveBeenCalled();
    });

    it('should close delete modal and clear selectedId', () => {
      const dialog = mockDialog();

      (component as any).modal = signal({
        nativeElement: dialog
      });

      component['selectedId'].set('123');

      component.closeDeleteModal();

      expect(component['selectedId']()).toBeNull();
      expect(dialog.close).toHaveBeenCalled();
    });
  });

  describe('Delete document', () => {
    it('should delete document successfully', () => {
      const dialog = mockDialog();

      (component as any).modal = signal({
        nativeElement: dialog
      });

      api.deleteDocument.and.returnValue(of(void 0));

      component.openDeleteModal('1');
      component.confirmDelete();

      expect(api.deleteDocument).toHaveBeenCalledWith('1');
      expect(toast.success).toHaveBeenCalledWith('Documento eliminado con éxito.');
      expect(component['documentsData']().length).toBe(0);
      expect(dialog.close).toHaveBeenCalled();
    });

    it('should show error toast when delete fails', () => {
      const dialog = mockDialog();

      (component as any).modal = signal({
        nativeElement: dialog
      });

      api.deleteDocument.and.returnValue(
        throwError(() => ({
          message: 'Error eliminando'
        }))
      );

      component.openDeleteModal('1');
      component.confirmDelete();

      expect(api.deleteDocument).toHaveBeenCalledWith('1');
      expect(toast.error).toHaveBeenCalledWith('Error eliminando');
    });

    it('should not call delete service if selectedId is null', () => {
      component.confirmDelete();

      expect(api.deleteDocument).not.toHaveBeenCalled();
    });

    it('should not call delete service if isLoading is true', () => {
      component['isLoading'].set(true);

      api.deleteDocument.and.returnValue(of(void 0));

      component['documentsApiService']('1');

      expect(api.deleteDocument).not.toHaveBeenCalled();
    });
  });

  describe('Internal methods', () => {
    it('should remove document from list', () => {
      component['removeDocumentFromList']('1');

      expect(component['documentsData']().length).toBe(0);
    });
  });
});
