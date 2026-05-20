import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentsList } from './documents-list';
import { DocumentTypeIcon } from '@shared/services/document-type-icon';
import { BadgesCarousel } from '@shared/components/badges-carousel/badges-carousel';

describe('DocumentsList', () => {
  let component: DocumentsList;
  let fixture: ComponentFixture<DocumentsList>;

  let router: jasmine.SpyObj<Router>;
  let docType: jasmine.SpyObj<DocumentTypeIcon>;

  const mockDocuments = [
    {
      id: '1',
      title: 'documento uno',
      description: 'desc',
      fileName: 'file.pdf',
      filePath: '/files/file.pdf',
      categories: ['cat1', 'cat2']
    }
  ] as any;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    docType = jasmine.createSpyObj('DocumentTypeIcon', ['documentIcon']);
    docType.documentIcon.and.returnValue('icon-path.svg');

    await TestBed.configureTestingModule({
      imports: [DocumentsList, BadgesCarousel],
      providers: [
        { provide: Router, useValue: router },
        { provide: DocumentTypeIcon, useValue: docType },
        TitleCasePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return icon from DocumentTypeIcon service', () => {
    const result = component['iconType']('file.pdf');

    expect(docType.documentIcon).toHaveBeenCalledWith('file.pdf');
    expect(result).toBe('icon-path.svg');
  });

  it('should navigate with search category', () => {
    component['searchCategory']('agua');

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { search: 'agua', filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });

  it('should accept documents input', () => {
    (component as any).documents = () => mockDocuments;

    expect(component.documents()).toEqual(mockDocuments);
  });

  it('should render document rows', () => {
    (component as any).documents = () => mockDocuments;

    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');

    expect(rows.length).toBe(1);
  });

  it('should render document title and description', () => {
    (component as any).documents = () => mockDocuments;

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Documento Uno');
    expect(compiled.textContent).toContain('desc');
  });

  it('should render download link with correct href', () => {
    (component as any).documents = () => mockDocuments;

    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toContain('/files/file.pdf');
  });
});
