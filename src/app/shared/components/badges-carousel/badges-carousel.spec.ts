import { Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgesCarousel } from './badges-carousel';

describe('BadgesCarousel', () => {
  let component: BadgesCarousel;
  let fixture: ComponentFixture<BadgesCarousel>;
  let router: jasmine.SpyObj<Router>;

  let mockContainer: any;
  let scrollBySpy: jasmine.Spy;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    scrollBySpy = jasmine.createSpy('scrollBy');

    mockContainer = {
      scrollWidth: 500,
      clientWidth: 200,
      scrollLeft: 0,
      scrollBy: scrollBySpy,
    };

    await TestBed.configureTestingModule({
      imports: [BadgesCarousel],
      providers: [
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BadgesCarousel);
    component = fixture.componentInstance;

    // IMPORTANT: mock BEFORE lifecycle
    (component as any).container = () => ({
      nativeElement: mockContainer
    });

    fixture.componentRef.setInput('badges', ['a', 'b', 'c']);

    component.ngAfterViewInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize state on init', () => {
    expect(component.hasOverflow()).toBeTrue();
    expect(component.isAtStart()).toBeTrue();
    expect(component.isAtEnd()).toBeFalse();
  });

  it('should update state on scroll', () => {
    mockContainer.scrollLeft = 300;

    component.onScroll();

    expect(component.isAtStart()).toBeFalse();
  });

  it('should scroll forward', () => {
    component.scrollForward();

    expect(scrollBySpy).toHaveBeenCalledWith({
      left: 160,
      behavior: 'smooth'
    });
  });

  it('should scroll backward', () => {
    component.scrollBackward();

    expect(scrollBySpy).toHaveBeenCalledWith({
      left: -160,
      behavior: 'smooth'
    });
  });

  it('should navigate on badge click', () => {
    (component as any).searchBadge('water');

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { search: 'water', filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });

  it('should update state when at end', () => {
    mockContainer.scrollLeft = 300;

    component.onScroll();

    expect(component.isAtEnd()).toBeTrue();
  });
});
