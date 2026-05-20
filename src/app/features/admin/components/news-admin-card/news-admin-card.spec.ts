import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsAdminCard } from './news-admin-card';
import { NewResponse } from '@shared/interfaces/new-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';

describe('NewsAdminCard', () => {
  let component: NewsAdminCard;
  let fixture: ComponentFixture<NewsAdminCard>;

  const mockStatuses: StatusResponse[] = [
    {
      id: 'draft-status',
      name: 'Borrador'
    } as StatusResponse,
    {
      id: 'public-status',
      name: 'Publicado'
    } as StatusResponse
  ];

  const mockNew: NewResponse = {
    id: 'new-1',
    slug: 'noticia-importante',
    title: 'noticia importante',
    statusId: 'public-status',
    lastEditionDate: new Date('2026-05-19')
  } as NewResponse;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewsAdminCard
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsAdminCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput(
      'statuses',
      mockStatuses
    );

    fixture.componentRef.setInput(
      'newData',
      mockNew
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Statuses effect', () => {
    it('should set draft and public statuses', () => {
      expect(component['draftStatus']().id)
        .toBe('draft-status');

      expect(component['publicStatus']().id)
        .toBe('public-status');
    });
  });

  describe('Delete new', () => {
    it('should emit delete request', () => {
      spyOn(component.deleteRequest, 'emit');

      component.onDeleteNew();

      expect(component.deleteRequest.emit)
        .toHaveBeenCalledWith('new-1');
    });

    it('should not emit delete request when id is undefined', () => {
      spyOn(component.deleteRequest, 'emit');

      fixture.componentRef.setInput(
        'newData',
        undefined
      );

      fixture.detectChanges();

      component.onDeleteNew();

      expect(component.deleteRequest.emit)
        .not
        .toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('should render new title', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Noticia Importante');
    });

    it('should render last edition date', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Última edición:');
    });

    it('should render public status indicator', () => {
      const indicator = fixture.debugElement.query(
        By.css('.bg-success')
      );

      expect(indicator)
        .toBeTruthy();
    });

    it('should render draft status indicator', () => {
      fixture.componentRef.setInput(
        'newData',
        {
          ...mockNew,
          statusId: 'draft-status'
        }
      );

      fixture.detectChanges();

      const indicator = fixture.debugElement.query(
        By.css('.bg-warning')
      );

      expect(indicator)
        .toBeTruthy();
    });

    it('should render public link when news is published', () => {
      const link = fixture.debugElement.query(
        By.css('a[target="_blank"]')
      );

      expect(link)
        .toBeTruthy();

      expect(link.attributes['href'])
        .toContain('/noticia/noticia-importante');
    });

    it('should not render public link when news is draft', () => {
      fixture.componentRef.setInput(
        'newData',
        {
          ...mockNew,
          statusId: 'draft-status'
        }
      );

      fixture.detectChanges();

      const link = fixture.debugElement.query(
        By.css('a[target="_blank"]')
      );

      expect(link)
        .toBeNull();
    });

    it('should call onDeleteNew when delete button is clicked', () => {
      spyOn(component, 'onDeleteNew');

      const buttons = fixture.debugElement.queryAll(
        By.css('button')
      );

      const deleteButton = buttons.find(button =>
        button.nativeElement.textContent
          .includes('Eliminar')
      );

      deleteButton?.nativeElement.click();

      expect(component.onDeleteNew)
        .toHaveBeenCalled();
    });

    it('should render edit links', () => {
      const links = fixture.debugElement.queryAll(
        By.css('a')
      );

      const adminEditLink = links.find(link =>
        link.nativeElement.href.includes('/admin/noticia/new-1')
      );

      expect(adminEditLink)
        .toBeTruthy();
    });
  });
});
