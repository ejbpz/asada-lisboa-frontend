import { By } from '@angular/platform-browser';
import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminNewsList } from './admin-news-list';
import { NewsApi } from '@core/services/news-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { NewsAdminCard } from '../news-admin-card/news-admin-card';
import { NewResponse } from '@shared/interfaces/new-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';

@Component({
  selector: 'news-admin-card',
  standalone: true,
  template: ''
})
class MockNewsAdminCard {
  public newData = input.required<NewResponse>();
  public statuses = input.required<StatusResponse[]>();
  public deleteRequest = output<string>();
}

describe('AdminNewsList', () => {
  let component: AdminNewsList;
  let fixture: ComponentFixture<AdminNewsList>;

  let newsApiSpy: jasmine.SpyObj<NewsApi>;
  let toastSpy: jasmine.SpyObj<ToastMessage>;

  const mockStatuses: StatusResponse[] = [
    {
      id: '1',
      name: 'published'
    }
  ];

  const mockNews: NewResponse[] = [
    {
      id: '1',
      title: 'News 1',
      description: 'Description 1',
      imageUrl: '/imagenes/image-1.jpg',
      categories: ['Angular'],
      publicationDate: new Date(),
      statusId: '1',
      fileName: 'image-1.jpg',
      filePath: 'imagenes/image-1.jpg',
      lastEditionDate: new Date(),
      slug: 'image-1',
      statusName: 'Publicado',
    },
    {
      id: '2',
      title: 'News 2',
      description: 'Description 2',
      imageUrl: '/imagenes/image-2.jpg',
      categories: ['.NET'],
      publicationDate: new Date(),
      statusId: '2',
      fileName: 'image-2.jpg',
      filePath: 'imagenes/image-2.jpg',
      lastEditionDate: new Date(),
      slug: 'image-2',
      statusName: 'Borrador',
    }
  ];

  beforeEach(async () => {
    newsApiSpy = jasmine.createSpyObj('NewsApi', [
      'deleteNew'
    ]);

    toastSpy = jasmine.createSpyObj('ToastMessage', [
      'success',
      'error'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AdminNewsList,
        MockNewsAdminCard
      ],
      providers: [
        {
          provide: NewsApi,
          useValue: newsApiSpy
        },
        {
          provide: ToastMessage,
          useValue: toastSpy
        }
      ]
    })
    .overrideComponent(AdminNewsList, {
      remove: {
        imports: [NewsAdminCard]
      },
      add: {
        imports: [MockNewsAdminCard]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewsList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('news', mockNews);
    fixture.componentRef.setInput('statuses', mockStatuses);

    fixture.detectChanges();

    const modal = document.createElement('dialog');

    modal.showModal = jasmine.createSpy('showModal');
    modal.close = jasmine.createSpy('close');

    (component as any).modal = () => ({
      nativeElement: modal
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize news data on init', () => {
    expect(component['newsData']()).toEqual(mockNews);
  });

  it('should render news cards', () => {
    const cards = fixture.debugElement.queryAll(
      By.directive(MockNewsAdminCard)
    );

    expect(cards.length).toBe(2);
  });

  it('should open delete modal', () => {
    component['openDeleteModal']('1');

    expect(component['selectedId']()).toBe('1');

    expect(
      (component as any)
        .modal()
        .nativeElement
        .showModal
    ).toHaveBeenCalled();
  });

  it('should close delete modal', () => {
    component['selectedId'].set('1');

    component['closeDeleteModal']();

    expect(component['selectedId']()).toBeNull();

    expect(
      (component as any)
        .modal()
        .nativeElement
        .close
    ).toHaveBeenCalled();
  });

  it('should return if confirmDelete has no selected id', () => {
    const spy = spyOn<any>(
      component,
      'newsApiService'
    );

    component['confirmDelete']();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call newsApiService on confirmDelete', () => {
    component['selectedId'].set('1');

    const spy = spyOn<any>(
      component,
      'newsApiService'
    );

    component['confirmDelete']();

    expect(spy).toHaveBeenCalledWith('1');
  });

  it('should remove new from list', () => {
    component['removeNewFromList']('1');

    expect(component['newsData']().length).toBe(1);

    expect(component['newsData']()[0].id).toBe('2');
  });

  it('should delete new successfully', () => {
    newsApiSpy.deleteNew.and.returnValue(
      of(void 0)
    );

    const closeSpy = spyOn<any>(
      component,
      'closeDeleteModal'
    ).and.callThrough();

    component['newsApiService']('1');

    expect(newsApiSpy.deleteNew)
      .toHaveBeenCalledWith('1');

    expect(toastSpy.success)
      .toHaveBeenCalledWith(
        'Noticia eliminada con éxito.'
      );

    expect(closeSpy)
      .toHaveBeenCalled();

    expect(component['newsData']().length)
      .toBe(1);

    expect(component['isLoading']())
      .toBeFalse();
  });

  it('should show error toast when delete fails', () => {
    const error: AppError = {
      message: 'Delete error'
    } as AppError;

    newsApiSpy.deleteNew.and.returnValue(
      throwError(() => error)
    );

    component['newsApiService']('1');

    expect(toastSpy.error)
      .toHaveBeenCalledWith('Delete error');

    expect(component['isLoading']())
      .toBeFalse();
  });

  it('should not call delete service if loading', () => {
    component['isLoading'].set(true);

    component['newsApiService']('1');

    expect(newsApiSpy.deleteNew)
      .not.toHaveBeenCalled();
  });

  it('should render dialog buttons', () => {
    const buttons = fixture.debugElement.queryAll(
      By.css('button')
    );

    expect(buttons.length).toBe(2);
  });
});
