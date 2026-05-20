import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentsCard } from './documents-card';
import { DocumentTypeIcon } from '@shared/services/document-type-icon';

describe('DocumentsCard', () => {
  let component: DocumentsCard;
  let fixture: ComponentFixture<DocumentsCard>;

  const mockDocumentType = {
    documentIcon: jasmine.createSpy('documentIcon').and.returnValue('icon.svg')
  };

  const mockDocument = {
    title: 'Documento Uno',
    description: 'Descripcion Prueba',
    filePath: '/file.pdf'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsCard],
      providers: [
        { provide: DocumentTypeIcon, useValue: mockDocumentType }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('document', mockDocument);
    fixture.detectChanges();
  });

  it('should render title correctly', () => {
    const title = fixture.nativeElement.querySelector('h4');
    expect(title.textContent).toContain('Documento Uno');
  });

  it('should render description correctly', () => {
    const desc = fixture.nativeElement.querySelector('p');
    expect(desc.textContent).toContain('Descripcion Prueba');
  });

  it('should call icon service', () => {
    expect(mockDocumentType.documentIcon).toHaveBeenCalledWith('/file.pdf');
  });

  it('should render link with generated url', () => {
    const link = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBeTruthy();
  });
});
