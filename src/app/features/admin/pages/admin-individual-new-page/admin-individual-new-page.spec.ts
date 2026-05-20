import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Component, input } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { NewsApi } from '@core/services/news-api';
import AdminIndividualNewPage from './admin-individual-new-page';
import { NewResponse } from '@shared/interfaces/new-response.interface';
import { AdminNewForm } from '@admin/components/admin-new-form/admin-new-form';
import { GetBackTitle } from '@shared/components/get-back-title/get-back-title';

@Component({
  selector: 'admin-new-form',
  template: ''
})
class MockAdminNewForm {
  newToUpdate = input<NewResponse | undefined>();
}

@Component({
  selector: 'get-back-title',
  template: '{{ title() }}'
})
class MockGetBackTitle {
  title = input.required<string>();
  link = input<string>();
  isAdmin = input<boolean>();
}

describe('AdminIndividualNewPage', () => {
  let component: AdminIndividualNewPage;
  let fixture: ComponentFixture<AdminIndividualNewPage>;

  let newsApi: jasmine.SpyObj<NewsApi>;

  const mockNew: NewResponse = {
    id: '1',
    statusId: '1',
    statusName: 'Publicado',
    slug: 'noticia-importante',
    title: 'Noticia importante',
    content: 'Contenido noticia',
    description: 'Descripción noticia',
    fileName: 'noticia-importante.png',
    filePath: 'noticias/noticia-importante.png',
    imageUrl: '/noticias/noticia-importante.png',
    categories: [],
    publicationDate: new Date(),
    lastEditionDate: new Date(),
  } as NewResponse;

  beforeEach(async () => {
    newsApi = jasmine.createSpyObj<NewsApi>(
      'NewsApi',
      ['getAdminNew']
    );

    newsApi.getAdminNew
      .and
      .returnValue(of(mockNew));

    await TestBed.configureTestingModule({
      imports: [AdminIndividualNewPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: NewsApi,
          useValue: newsApi
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: '1'
            })
          }
        }
      ]
    })
    .overrideComponent(AdminIndividualNewPage, {
      remove: {
        imports: [
          GetBackTitle,
          AdminNewForm
        ]
      },
      add: {
        imports: [
          MockGetBackTitle,
          MockAdminNewForm
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(
      AdminIndividualNewPage
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
        .toBe('1');
    });
  });

  describe('New resource', () => {
    it('should call get admin new service', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      expect(newsApi.getAdminNew)
        .toHaveBeenCalledWith('1');
    }));

    it('should set new resource value', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      expect(component['newResource'].value())
        .toEqual(mockNew);
    }));
  });

  describe('Template rendering', () => {
    it('should render edition title', () => {
      const title = fixture.debugElement.query(
        By.directive(MockGetBackTitle)
      );

      expect(title.componentInstance.title())
        .toBe('Creación de noticia');
    });

    it('should render admin new form', () => {
      const form = fixture.debugElement.query(
        By.css('admin-new-form')
      );

      expect(form)
        .toBeTruthy();
    });

    it('should pass new to admin new form', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      const form = fixture.debugElement.query(
        By.directive(MockAdminNewForm)
      );

      expect(
        form.componentInstance.newToUpdate()
      ).toEqual(mockNew);
    }));
  });

  describe('Without route id', () => {
    let emptyFixture: ComponentFixture<AdminIndividualNewPage>;
    let emptyComponent: AdminIndividualNewPage;

    beforeEach(async () => {
      const emptyNewsApi = jasmine.createSpyObj<NewsApi>(
        'NewsApi',
        ['getAdminNew']
      );

      emptyNewsApi.getAdminNew
        .and
        .returnValue(of(mockNew));

      await TestBed.resetTestingModule();

      await TestBed.configureTestingModule({
        imports: [AdminIndividualNewPage],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          {
            provide: NewsApi,
            useValue: emptyNewsApi
          },
          {
            provide: ActivatedRoute,
            useValue: {
              params: of({})
            }
          }
        ]
      })
      .overrideComponent(AdminIndividualNewPage, {
        remove: {
          imports: [
            GetBackTitle,
            AdminNewForm
          ]
        },
        add: {
          imports: [
            MockGetBackTitle,
            MockAdminNewForm
          ]
        }
      })
      .compileComponents();

      emptyFixture = TestBed.createComponent(
        AdminIndividualNewPage
      );

      emptyComponent = emptyFixture.componentInstance;

      emptyFixture.detectChanges();
    });

    it('should return undefined when id does not exist', fakeAsync(() => {
      tick();

      emptyFixture.detectChanges();

      expect(
        emptyComponent['newResource'].value()
      ).toBeUndefined();
    }));

    it('should render creation title', () => {
      const title = emptyFixture.debugElement.query(
        By.directive(MockGetBackTitle)
      );

      expect(title.componentInstance.title())
        .toBe('Creación de noticia');
    });
  });
});
