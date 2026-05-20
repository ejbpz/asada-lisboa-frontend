import { By } from '@angular/platform-browser';
import { Component, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { GalleryApi } from '@core/services/gallery-api';
import AdminIndividualImagePage from './admin-individual-image-page';
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { GetBackTitle } from '@shared/components/get-back-title/get-back-title';
import { AdminImageForm } from '@admin/components/admin-image-form/admin-image-form';

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

@Component({
  selector: 'admin-image-form',
  template: ''
})
class MockAdminImageForm {
  imageToUpdate = input<ImageResponse | undefined>();
}

describe('AdminIndividualImagePage', () => {
  let component: AdminIndividualImagePage;
  let fixture: ComponentFixture<AdminIndividualImagePage>;

  let galleryApi: jasmine.SpyObj<GalleryApi>;

  const mockImage: ImageResponse = {
    id: 'image-1',
    title: 'Imagen importante',
    description: 'Descripción imagen',
    filePath: '/images/test.webp',
    statusId: 'status-public'
  } as ImageResponse;

  beforeEach(async () => {
    galleryApi = jasmine.createSpyObj<GalleryApi>(
      'GalleryApi',
      ['getAdminImage']
    );

    galleryApi.getAdminImage
      .and
      .returnValue(of(mockImage));

    await TestBed.configureTestingModule({
      imports: [
        AdminIndividualImagePage
      ],
      providers: [
        {
          provide: GalleryApi,
          useValue: galleryApi
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: 'image-1'
            })
          }
        }
      ]
    })
    .overrideComponent(AdminIndividualImagePage, {
      remove: {
        imports: [
          GetBackTitle,
          AdminImageForm
        ]
      },
      add: {
        imports: [
          MockGetBackTitle,
          MockAdminImageForm
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(
      AdminIndividualImagePage
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
        .toBe('image-1');
    });
  });

  describe('Image resource', () => {
    it('should call get admin image service', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      expect(galleryApi.getAdminImage)
        .toHaveBeenCalledWith('image-1');
    }));

    it('should set image resource value', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      expect(component['imageResource'].value())
        .toEqual(mockImage);
    }));
  });

  describe('Template rendering', () => {
    it('should render page title', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Creación de imagen');
    });

    it('should render admin image form', () => {
      const form = fixture.debugElement.query(
        By.css('admin-image-form')
      );

      expect(form)
        .toBeTruthy();
    });

    it('should pass image to admin image form', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      const form = fixture.debugElement.query(
        By.css('admin-image-form')
      );

      expect(
        form.componentInstance.imageToUpdate()
      ).toEqual(mockImage);
    }));
  });
});

describe('AdminIndividualImagePage without id', () => {
  let component: AdminIndividualImagePage;
  let fixture: ComponentFixture<AdminIndividualImagePage>;

  let galleryApi: jasmine.SpyObj<GalleryApi>;

  beforeEach(async () => {
    galleryApi = jasmine.createSpyObj<GalleryApi>(
      'GalleryApi',
      ['getAdminImage']
    );

    await TestBed.configureTestingModule({
      imports: [
        AdminIndividualImagePage
      ],
      providers: [
        {
          provide: GalleryApi,
          useValue: galleryApi
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    })
    .overrideComponent(AdminIndividualImagePage, {
      remove: {
        imports: [
          GetBackTitle,
          AdminImageForm
        ]
      },
      add: {
        imports: [
          MockGetBackTitle,
          MockAdminImageForm
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(
      AdminIndividualImagePage
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Image resource', () => {
    it('should return undefined when id does not exist', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      expect(galleryApi.getAdminImage)
        .not
        .toHaveBeenCalled();

      expect(component['imageResource'].value())
        .toBeUndefined();
    }));
  });

  describe('Template rendering', () => {
    it('should render creation title', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Creación de imagen');
    }));

    it('should pass undefined to admin image form', fakeAsync(() => {
      tick();

      fixture.detectChanges();

      const form = fixture.debugElement.query(
        By.css('admin-image-form')
      );

      expect(
        form.componentInstance.imageToUpdate()
      ).toBeUndefined();
    }));
  });
});
