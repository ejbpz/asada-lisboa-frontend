import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CarouselNews } from './carousel-news';

describe('CarouselNews', () => {
  let component: CarouselNews;
  let fixture: ComponentFixture<CarouselNews>;

  const mockNews = [
    { id: '1', title: 'News 1' },
    { id: '2', title: 'News 2' }
  ] as any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CarouselNews
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselNews);
    component = fixture.componentInstance;

    // input signal mock
    component.news = signal(mockNews) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize without crashing when carousel is missing', () => {
    expect(() => component.ngAfterViewInit()).not.toThrow();
  });

  it('should call scrollBy when scrolling right', fakeAsync(() => {
    const div = document.createElement('div');

    const firstChild = document.createElement('div');
    Object.defineProperty(firstChild, 'clientWidth', { value: 100 });

    div.appendChild(firstChild);

    spyOn(div as any, 'scrollBy');

    (component as any).carouselReference = () => ({
      nativeElement: div
    });

    (component as any).cardWidth = 100;

    component.scrollRight();

    tick(300);

    expect((div as any).scrollBy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        left: 120,
        behavior: 'smooth'
      })
    );
  }));

  it('should call scrollBy when scrolling left', fakeAsync(() => {
    const div = document.createElement('div');

    spyOn(div, 'scrollBy');

    (component as any).carouselReference = () => ({
      nativeElement: div
    });

    (component as any).cardWidth = 100;

    component.scrollLeft();

    tick(300);

    expect((div as any).scrollBy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        left: -120,
        behavior: 'smooth'
      })
    );
  }));

  it('should set minIndex true when at start', () => {
    const div = document.createElement('div');

    Object.defineProperty(div, 'scrollWidth', { value: 500 });
    Object.defineProperty(div, 'clientWidth', { value: 200 });
    div.scrollLeft = 0;

    (component as any).carouselReference = () => ({
      nativeElement: div
    });

    (component as any).updateLimits();

    expect(component.minIndex()).toBeTrue();
  });

  it('should set maxIndex true when at end', () => {
    const div = document.createElement('div');

    Object.defineProperty(div, 'scrollWidth', { value: 500 });
    Object.defineProperty(div, 'clientWidth', { value: 200 });

    Object.defineProperty(div, 'scrollLeft', {
      value: 300,
      writable: true
    });

    (component as any).carouselReference = () => ({
      nativeElement: div
    });

    (component as any).updateLimits();

    expect(component.maxIndex()).toBeTrue();
  });

  it('should not fail ngAfterViewInit when no children exist', () => {
    const div = document.createElement('div');

    (component as any).carouselReference = () => ({
      nativeElement: div
    });

    expect(() => component.ngAfterViewInit()).not.toThrow();
  });
});
