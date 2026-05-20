import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryList } from './gallery-list';

describe('GalleryList', () => {
  let component: GalleryList;
  let fixture: ComponentFixture<GalleryList>;

  const mockImages = [
    { id: '1', filePath: '/img1.jpg', title: 'img1' },
    { id: '2', filePath: '/img2.jpg', title: 'img2' },
    { id: '3', filePath: '/img3.jpg', title: 'img3' }
  ] as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryList]
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize first image on init', () => {
    (component as any).images = () => mockImages;

    component.ngOnInit();

    expect(component['totalImageCount']()).toBe(3);
    expect(component['currentLightboxImage']()).toEqual(mockImages[0]);
  });

  it('should open lightbox on click image', () => {
    (component as any).images = () => mockImages;

    component.onClickImage(1);

    expect(component['showMask']()).toBeTrue();
    expect(component['showCount']()).toBeTrue();
    expect(component['previewImage']()).toBeTrue();
    expect(component['currentIndex']()).toBe(1);
    expect(component['currentLightboxImage']()).toEqual(mockImages[1]);
  });

  it('should close lightbox and reset state', () => {
    (component as any).images = () => mockImages;

    component.ngOnInit();
    component.onClickImage(1);

    component.onCloseImage();

    expect(component['showMask']()).toBeFalse();
    expect(component['showCount']()).toBeFalse();
    expect(component['previewImage']()).toBeFalse();
    expect(component['currentIndex']()).toBe(0);
    expect(component['currentLightboxImage']()).toBeNull();
  });

  it('should go to next image', () => {
    (component as any).images = () => mockImages;

    component.ngOnInit();
    component.onClickImage(0);

    component.nextImage();

    expect(component['currentIndex']()).toBe(1);
    expect(component['currentLightboxImage']()).toEqual(mockImages[1]);
  });

  it('should wrap to first image when next exceeds limit', () => {
    (component as any).images = () => mockImages;

    component.ngOnInit();
    component.onClickImage(2);

    component.nextImage();

    expect(component['currentIndex']()).toBe(0);
    expect(component['currentLightboxImage']()).toEqual(mockImages[0]);
  });

  it('should go to previous image', () => {
    (component as any).images = () => mockImages;

    component.ngOnInit();
    component.onClickImage(1);

    component.previousImage();

    expect(component['currentIndex']()).toBe(0);
    expect(component['currentLightboxImage']()).toEqual(mockImages[0]);
  });

  it('should wrap to last image when previous goes below 0', () => {
    (component as any).images = () => mockImages;

    component.ngOnInit();
    component.onClickImage(0);

    component.previousImage();

    expect(component['currentIndex']()).toBe(2);
    expect(component['currentLightboxImage']()).toEqual(mockImages[2]);
  });

  it('should navigate left with keyboard', () => {
    (component as any).images = () => mockImages;

    component.onClickImage(1);
    component.onKeyboardPress(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

    expect(component['currentIndex']()).toBe(0);
  });

  it('should navigate right with keyboard', () => {
    (component as any).images = () => mockImages;

    component.ngOnInit();
    component.onClickImage(0);

    component.onKeyboardPress(
      new KeyboardEvent('keydown', { key: 'ArrowRight' })
    );

    expect(component['currentIndex']()).toBe(1);
  });

  it('should close lightbox on Escape key', () => {
    (component as any).images = () => mockImages;

    component.onClickImage(0);
    component.onKeyboardPress(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component['showMask']()).toBeFalse();
  });

  it('should ignore keyboard when lightbox is closed', () => {
    (component as any).images = () => mockImages;

    const spy = spyOn(component, 'nextImage');

    component.onKeyboardPress(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(spy).not.toHaveBeenCalled();
  });
});
