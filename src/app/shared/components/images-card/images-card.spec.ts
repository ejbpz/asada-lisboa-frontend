import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImagesCard } from './images-card';

describe('ImagesCard', () => {
  let component: ImagesCard;
  let fixture: ComponentFixture<ImagesCard>;

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockImage = {
    filePath: '/img.jpg',
    title: 'Imagen Uno',
    description: 'Descripcion prueba',
    categories: ['cat1', 'cat2']
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagesCard],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImagesCard);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('image', mockImage);
    fixture.componentRef.setInput('index', 3);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render image with correct src and alt', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(img.src).toContain('/img.jpg');
    expect(img.alt).toBe('Imagen Uno');
  });

  it('should render title and description in overlay', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Imagen Uno');
    expect(compiled.textContent).toContain('Descripcion prueba');
  });

  it('should emit index on click image', () => {
    spyOn(component.showIndex, 'emit');

    const figure = fixture.nativeElement.querySelector('figure');
    figure.click();

    expect(component.showIndex.emit).toHaveBeenCalledWith(3);
  });

  it('should call router navigate when searching category', () => {
    (component as any).searchCategory('water');

    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      queryParams: { search: 'water', filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });
});
