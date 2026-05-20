import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, input } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { DocumentsApi } from '@core/services/documents-api';
import AdminIndividualDocumentPage from './admin-individual-document-page';
import { GetBackTitle } from '@shared/components/get-back-title/get-back-title';
import { DocumentResponse } from '@admin/interfaces/document-response.interface';
import { AdminDocumentForm } from '@admin/components/admin-document-form/admin-document-form';

@Component({
  selector: 'admin-document-form',
  template: ''
})
class MockAdminDocumentForm {
  documentToUpdate = input<DocumentResponse | undefined>();
}

@Component({
  selector: 'get-back-title',
  template: `
    <h1>{{ title() }}</h1>
    <ng-content />
  `
})
class MockGetBackTitle {
  title = input.required<string>();
  link = input<string>();
  isAdmin = input<boolean>();
}

describe('AdminIndividualDocumentPage', () => {
  let component: AdminIndividualDocumentPage;
  let fixture: ComponentFixture<AdminIndividualDocumentPage>;

  let documentsApi: jasmine.SpyObj<DocumentsApi>;

  const mockDocument: DocumentResponse = {
    id: 'document-1',
    title: 'Documento importante',
    description: 'Descripción documento',
    fileName: 'documento.pdf',
    filePath: '/documents/documento.pdf',
  } as DocumentResponse;

  beforeEach(async () => {
    documentsApi = jasmine.createSpyObj<DocumentsApi>(
      'DocumentsApi',
      ['getAdminDocument']
    );

    documentsApi.getAdminDocument
      .and
      .returnValue(of(mockDocument));

    await TestBed.configureTestingModule({
      imports: [AdminIndividualDocumentPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: DocumentsApi,
          useValue: documentsApi
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: 'document-1'
            })
          }
        }
      ]
    })
    .overrideComponent(AdminIndividualDocumentPage, {
      remove: {
        imports: [GetBackTitle, AdminDocumentForm]
      },
      add: {
        imports: [MockGetBackTitle, MockAdminDocumentForm]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(
      AdminIndividualDocumentPage
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Route params', () => {
    it('should get id from route params', () => {
      expect(component['id']())
        .toBe('document-1');
    });
  });

  describe('Document resource', () => {
    it('should call get admin document service', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      expect(documentsApi.getAdminDocument)
        .toHaveBeenCalledWith('document-1');
    }));

    it('should set document resource value', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      expect(component['documentResource'].value())
        .toEqual(mockDocument);
    }));

    it('should return undefined when id does not exist', fakeAsync(() => {
      documentsApi.getAdminDocument.calls.reset();

      TestBed.resetTestingModule();

      TestBed.configureTestingModule({
        imports: [
          AdminIndividualDocumentPage
        ],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: DocumentsApi,
            useValue: documentsApi
          },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({})
            }
          }
        ]
      });

      const emptyFixture = TestBed.createComponent(
        AdminIndividualDocumentPage
      );

      const emptyComponent = emptyFixture.componentInstance;

      emptyFixture.detectChanges();

      tick();

      expect(documentsApi.getAdminDocument)
        .not
        .toHaveBeenCalled();

      expect(
        emptyComponent['documentResource'].value()
      ).toBeUndefined();
    }));
  });

  describe('Template rendering', () => {
    it('should render page title', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Creación de documento');
    });

    it('should render admin document form', () => {
      const form = fixture.debugElement.query(
        By.css('admin-document-form')
      );

      expect(form)
        .toBeTruthy();
    });

    it('should pass document to admin document form', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      const form = fixture.debugElement.query(
        By.css('admin-document-form')
      );

      expect(
        form.componentInstance.documentToUpdate()
      ).toEqual(mockDocument);
    }));

    it('should render creation title when document does not exist', fakeAsync(() => {
      TestBed.resetTestingModule();

      TestBed.configureTestingModule({
        imports: [
          AdminIndividualDocumentPage
        ],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: DocumentsApi,
            useValue: documentsApi
          },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({})
            }
          }
        ]
      });

      const emptyFixture = TestBed.createComponent(
        AdminIndividualDocumentPage
      );

      emptyFixture.detectChanges();

      tick();

      emptyFixture.detectChanges();

      const compiled = emptyFixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Creación De Documento');
    }));
  });
});
