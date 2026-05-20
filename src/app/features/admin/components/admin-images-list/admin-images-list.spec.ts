import { By } from '@angular/platform-browser';
import { Component, input, output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminImagesList } from './admin-images-list';
import { GalleryApi } from '@core/services/gallery-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';

@Component({
  selector: 'images-admin-card',
  standalone: true,
  template: ''
})
class MockImagesAdminCard {
  image = input.required<ImageResponse>();
  statuses = input.required<StatusResponse[]>();
  deleteRequest = output<string>();
}

describe('AdminImagesList', () => {
  let component: AdminImagesList;
  let fixture: ComponentFixture<AdminImagesList>;

  let galleryApiSpy: jasmine.SpyObj<GalleryApi>;
  let toastSpy: jasmine.SpyObj<ToastMessage>;

  const mockStatuses: StatusResponse[] = [
    {
      id: '1',
      name: 'active'
    }
  ];

  const mockImages: ImageResponse[] = [
    {
      id: '1',
      statusId: '1',
      slug: 'image-1',
      title: 'Image 1',
      statusName: 'Publicado',
      fileName: 'image-1.jpg',
      description: 'Description 1',
      url: '/imagenes/image-1.jpg',
      filePath: 'imagenes/image-1.jpg',
      fileSize: 7871,
      categories: [],
      publicationDate: new Date(),
    },
    {
      id: '2',
      statusId: '2',
      slug: 'image-2',
      title: 'Image 2',
      statusName: 'Publicado',
      fileName: 'image-2.jpg',
      description: 'Description 2',
      url: '/imagenes/image-2.jpg',
      filePath: 'imagenes/image-2.jpg',
      fileSize: 1541,
      categories: [],
      publicationDate: new Date(),
    }
  ];

  beforeEach(async () => {
    galleryApiSpy = jasmine.createSpyObj('GalleryApi', [
      'deleteImage'
    ]);

    toastSpy = jasmine.createSpyObj('ToastMessage', [
      'success',
      'error'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        AdminImagesList,
        MockImagesAdminCard
      ],
      providers: [
        {
          provide: GalleryApi,
          useValue: galleryApiSpy
        },
        {
          provide: ToastMessage,
          useValue: toastSpy
        }
      ]
    })
    .overrideComponent(AdminImagesList, {
      set: {
        imports: [MockImagesAdminCard]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminImagesList);

    fixture.componentRef.setInput('images', mockImages);
    fixture.componentRef.setInput('statuses', mockStatuses);

    component = fixture.componentInstance;

    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('dialog');

    dialog.showModal = jasmine.createSpy('showModal');
    dialog.close = jasmine.createSpy('close');
  });

  describe('Component initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize imagesData on ngOnInit', () => {
      expect(component['imagesData']()).toEqual(mockImages);
    });

    it('should render image cards', () => {
      const cards = fixture.debugElement.queryAll(
        By.directive(MockImagesAdminCard)
      );

      expect(cards.length).toBe(2);
    });
  });

  describe('Delete modal', () => {
    it('should open delete modal and set selectedId', () => {
      component['openDeleteModal']('1');

      expect(component['selectedId']()).toBe('1');

      const dialog = fixture.nativeElement.querySelector('dialog');

      expect(dialog.showModal).toHaveBeenCalled();
    });

    it('should close delete modal and clear selectedId', () => {
      component['selectedId'].set('1');

      component['closeDeleteModal']();

      expect(component['selectedId']()).toBeNull();

      const dialog = fixture.nativeElement.querySelector('dialog');

      expect(dialog.close).toHaveBeenCalled();
    });
  });

  describe('Delete image', () => {
    it('should delete image successfully', () => {
      galleryApiSpy.deleteImage.and.returnValue(of(void 0));

      component['selectedId'].set('1');

      component['confirmDelete']();

      expect(galleryApiSpy.deleteImage).toHaveBeenCalledWith('1');

      expect(toastSpy.success)
        .toHaveBeenCalledWith('Imagen eliminada con éxito.');

      expect(component['imagesData']().length).toBe(1);

      expect(component['imagesData']()[0].id).toBe('2');

      expect(component['selectedId']()).toBeNull();
    });

    it('should show error toast when delete fails', () => {
      const mockError: AppError = {
        message: 'Error deleting image'
      } as AppError;

      galleryApiSpy.deleteImage.and.returnValue(
        throwError(() => mockError)
      );

      component['selectedId'].set('1');

      component['confirmDelete']();

      expect(galleryApiSpy.deleteImage).toHaveBeenCalledWith('1');

      expect(toastSpy.error)
        .toHaveBeenCalledWith('Error deleting image');

      expect(component['isLoading']()).toBeFalse();
    });

    it('should not call delete service if selectedId is null', () => {
      component['selectedId'].set(null);

      component['confirmDelete']();

      expect(galleryApiSpy.deleteImage).not.toHaveBeenCalled();
    });

    it('should not call delete service if isLoading is true', () => {
      component['isLoading'].set(true);

      component['selectedId'].set('1');

      component['confirmDelete']();

      expect(galleryApiSpy.deleteImage).not.toHaveBeenCalled();
    });
  });

  describe('Internal methods', () => {
    it('should remove image from list', () => {
      component['imagesData'].set(mockImages);

      component['removeImageFromList']('1');

      expect(component['imagesData']().length).toBe(1);

      expect(component['imagesData']()[0].id).toBe('2');
    });
  });

  describe('Template interactions', () => {
    it('should call openDeleteModal when deleteRequest emits', () => {
      spyOn(component as any, 'openDeleteModal');

      const card = fixture.debugElement.query(
        By.directive(MockImagesAdminCard)
      );

      card.componentInstance.deleteRequest.emit('1');

      expect(component['openDeleteModal'])
        .toHaveBeenCalledWith('1');
    });

    it('should call closeDeleteModal on cancel button click', () => {
      spyOn(component as any, 'closeDeleteModal');

      const buttons = fixture.nativeElement.querySelectorAll('button');

      buttons[0].click();

      expect(component['closeDeleteModal']).toHaveBeenCalled();
    });

    it('should call confirmDelete on delete button click', () => {
      spyOn(component as any, 'confirmDelete');

      const buttons = fixture.nativeElement.querySelectorAll('button');

      buttons[1].click();

      expect(component['confirmDelete']).toHaveBeenCalled();
    });
  });
});
