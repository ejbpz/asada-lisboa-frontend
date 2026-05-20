import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualNewCard } from './individual-new-card';
import { NewResponse } from '@shared/interfaces/new-response.interface';

describe('IndividualNewCard', () => {
  let component: IndividualNewCard;
  let fixture: ComponentFixture<IndividualNewCard>;

  const mockNew: NewResponse = {
    title: 'Noticia prueba',
    description: '<p>Contenido</p><img src="test.jpg" />',
    imageUrl: 'image.jpg',
    publicationDate: new Date('2025-01-01'),
    lastEditionDate: new Date('2025-01-02'),
  } as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualNewCard]
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualNewCard);
    component = fixture.componentInstance;

    (component as any).newData = () => mockNew;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Noticia prueba');
  });

  it('should render publication and edit date', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Publicado:');
    expect(compiled.textContent).toContain('Editado:');
  });

  it('should return false for sameDate when dates differ', () => {
    expect(component['sameDate']()).toBeFalse();
  });

  it('should open lightbox when clicking image', () => {
    const event = {
      target: {
        tagName: 'IMG',
        src: 'test.jpg'
      }
    } as unknown as MouseEvent;

    component.onContentClick(event);

    expect(component['showLightbox']()).toBeTrue();
    expect(component['currentImage']()).toBe('test.jpg');
  });

  it('should not open lightbox if click is not image', () => {
    const event = {
      target: {
        tagName: 'DIV'
      }
    } as unknown as MouseEvent;

    component.onContentClick(event);

    expect(component['showLightbox']()).toBeFalse();
  });

  it('should close lightbox and reset state', () => {
    component['showLightbox'].set(true);
    component['currentImage'].set('test.jpg');

    component.closeLightbox();

    expect(component['showLightbox']()).toBeFalse();
    expect(component['currentImage']()).toBeNull();
  });

  it('should not close lightbox if already closed', () => {
    component['showLightbox'].set(false);

    component.closeLightbox();

    expect(component['showLightbox']()).toBeFalse();
  });

  it('should close lightbox on escape key', () => {
    component['showLightbox'].set(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    component.closeLightbox();

    expect(component['showLightbox']()).toBeFalse();
  });

  it('should render image element', () => {
    const img = fixture.debugElement.query(By.css('img'));
    expect(img).toBeTruthy();
  });
});
