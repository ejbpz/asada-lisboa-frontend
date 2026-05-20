import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentsAdminCard } from './documents-admin-card';
import { GenerateContent } from '@shared/utils/generate-content';
import { DocumentTypeIcon } from '@shared/services/document-type-icon';
import { StatusResponse } from '@admin/interfaces/status-response.interface';
import { DocumentResponse } from '@admin/interfaces/document-response.interface';

describe('DocumentsAdminCard', () => {
  let component: DocumentsAdminCard;
  let fixture: ComponentFixture<DocumentsAdminCard>;

  let documentTypeIcon: jasmine.SpyObj<DocumentTypeIcon>;

  const mockStatuses: StatusResponse[] = [
    {
      id: 'status-1',
      name: 'Borrador'
    },
    {
      id: 'status-2',
      name: 'Publicado'
    }
  ];

  const mockDocument: DocumentResponse = {
    id: 'document-1',
    title: 'manual de usuario',
    description: 'Documento de pruebas',
    fileName: 'manual.pdf',
    filePath: 'documents/manual.pdf',
    statusId: 'status-2'
  } as DocumentResponse;

  beforeEach(async () => {
    documentTypeIcon = jasmine.createSpyObj<DocumentTypeIcon>(
      'DocumentTypeIcon',
      ['documentIcon']
    );

    documentTypeIcon.documentIcon
      .and
      .returnValue('assets/icons/pdf-icon.svg');

    await TestBed.configureTestingModule({
      imports: [
        DocumentsAdminCard
      ],
      providers: [
        provideRouter([]),
        {
          provide: DocumentTypeIcon,
          useValue: documentTypeIcon
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsAdminCard);

    component = fixture.componentInstance;

    fixture.componentRef.setInput(
      'statuses',
      mockStatuses
    );

    fixture.componentRef.setInput(
      'document',
      mockDocument
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Statuses effect', () => {
    it('should set draft status', () => {
      expect(component['draftStatus']().id)
        .toBe('status-1');
    });

    it('should set public status', () => {
      expect(component['publicStatus']().id)
        .toBe('status-2');
    });
  });

  describe('Delete document', () => {
    it('should emit delete request', () => {
      spyOn(component.deleteRequest, 'emit');

      component.onDeleteDocument();

      expect(component.deleteRequest.emit)
        .toHaveBeenCalledWith('document-1');
    });

    it('should not emit if document id does not exist', () => {
      spyOn(component.deleteRequest, 'emit');

      fixture.componentRef.setInput(
        'document',
        {
          ...mockDocument,
          id: undefined
        }
      );

      fixture.detectChanges();

      component.onDeleteDocument();

      expect(component.deleteRequest.emit)
        .not
        .toHaveBeenCalled();
    });
  });

  describe('Helper methods', () => {
    it('should return icon type', () => {
      const result = component['iconType']('manual.pdf');

      expect(documentTypeIcon.documentIcon)
        .toHaveBeenCalledWith('manual.pdf');

      expect(result)
        .toBe('assets/icons/pdf-icon.svg');
    });
  });

  describe('Template rendering', () => {
    it('should render document title', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Manual De Usuario');
    });

    it('should render document description', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Documento de pruebas');
    });

    it('should render publicado status', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Publicado');
    });

    it('should render borrador status', () => {
      fixture.componentRef.setInput(
        'document',
        {
          ...mockDocument,
          statusId: 'status-1'
        }
      );

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Borrador');
    });

    it('should render public document link', () => {
      fixture.detectChanges();

      const link = fixture.debugElement.query(
        By.css('a[href]')
      );

      expect(link)
        .toBeTruthy();

      expect(link.nativeElement.href)
        .toContain(
          GenerateContent.url(mockDocument.filePath)
        );
    });

    it('should not render public link for borrador', () => {
      fixture.componentRef.setInput(
        'document',
        {
          ...mockDocument,
          statusId: 'status-1'
        }
      );

      fixture.detectChanges();

      const links = fixture.debugElement.queryAll(
        By.css('a[href]')
      );

      const publicLink = links.find(link =>
        link.nativeElement.href.includes(
          GenerateContent.url(mockDocument.filePath)
        )
      );

      expect(publicLink)
        .toBeUndefined();
    });

    it('should call onDeleteDocument when delete button is clicked', () => {
      spyOn(component, 'onDeleteDocument');

      const buttons = fixture.debugElement.queryAll(
        By.css('button')
      );

      buttons[0].nativeElement.click();

      expect(component.onDeleteDocument)
        .toHaveBeenCalled();
    });
  });
});
