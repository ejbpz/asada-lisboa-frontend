import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagesAdminCard } from './images-admin-card';
import { GenerateContent } from '@shared/utils/generate-content';
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';

describe('ImagesAdminCard', () => {
  let component: ImagesAdminCard;
  let fixture: ComponentFixture<ImagesAdminCard>;

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

  const mockImage: ImageResponse = {
    id: 'image-1',
    title: 'imagen principal',
    description: 'Imagen de pruebas',
    filePath: 'images/image-1.webp',
    statusId: 'status-2'
  } as ImageResponse;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ImagesAdminCard
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImagesAdminCard);

    component = fixture.componentInstance;

    fixture.componentRef.setInput(
      'statuses',
      mockStatuses
    );

    fixture.componentRef.setInput(
      'image',
      mockImage
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

  describe('Delete image', () => {
    it('should emit delete request', () => {
      spyOn(component.deleteRequest, 'emit');

      component.onDeleteImage();

      expect(component.deleteRequest.emit)
        .toHaveBeenCalledWith('image-1');
    });

    it('should not emit if image id does not exist', () => {
      spyOn(component.deleteRequest, 'emit');

      fixture.componentRef.setInput(
        'image',
        {
          ...mockImage,
          id: undefined
        }
      );

      fixture.detectChanges();

      component.onDeleteImage();

      expect(component.deleteRequest.emit)
        .not
        .toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('should render image title', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Imagen Principal');
    });

    it('should render image description', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Imagen de pruebas');
    });

    it('should render image src', () => {
      const image = fixture.debugElement.query(
        By.css('img')
      );

      expect(image.nativeElement.src)
        .toContain(
          GenerateContent.url(mockImage.filePath)
        );
    });

    it('should render image alt', () => {
      const image = fixture.debugElement.query(
        By.css('img')
      );

      expect(image.nativeElement.alt)
        .toBe('imagen principal');
    });

    it('should render publicado badge', () => {
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Publicado');
    });

    it('should render borrador badge', () => {
      fixture.componentRef.setInput(
        'image',
        {
          ...mockImage,
          statusId: 'status-1'
        }
      );

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.textContent)
        .toContain('Borrador');
    });

    it('should render edit link', () => {
      const links = fixture.debugElement.queryAll(
        By.css('a')
      );

      const editLink = links.find(link =>
        link.nativeElement.textContent.includes('Editar')
      );

      expect(editLink)
        .toBeTruthy();
    });

    it('should call onDeleteImage when delete button is clicked', () => {
      spyOn(component, 'onDeleteImage');

      const buttons = fixture.debugElement.queryAll(
        By.css('button')
      );

      buttons[0].nativeElement.click();

      expect(component.onDeleteImage)
        .toHaveBeenCalled();
    });
  });
});
