import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SeoManagement } from './seo-management';
import { SeoRouteListener } from './seo-route-listener';

describe('SeoRouteListener', () => {
  let service: SeoRouteListener;
  let routerEvents$: Subject<any>;
  let seoSpy: jasmine.SpyObj<SeoManagement>;

  beforeEach(() => {
    routerEvents$ = new Subject();
    seoSpy = jasmine.createSpyObj('SeoManagement', ['setSeo']);

    const activatedRouteMock = {
      firstChild: {
        firstChild: null,
        snapshot: { data: { seo: { title: 'Test SEO' } } }
      },
      snapshot: { data: {} }
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SeoManagement, useValue: seoSpy },
        { provide: Router, useValue: { events: routerEvents$.asObservable() } },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ]
    });

    service = TestBed.inject(SeoRouteListener);
  });

  it('should call setSeo with route seo data', () => {
    service.init();

    routerEvents$.next(new NavigationEnd(1, '/a', '/b'));
    expect(seoSpy.setSeo).toHaveBeenCalledWith({ title: 'Test SEO' });
  });

  it('should call setSeo with empty object when no seo data', () => {
    const routerEvents$ = new Subject();
    const seoSpy = jasmine.createSpyObj('SeoManagement', ['setSeo']);
    const emptyRoute = {
      firstChild: {
        firstChild: null,
        snapshot: { data: {} }
      },
      snapshot: { data: {} }
    };

    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        SeoRouteListener,
        { provide: SeoManagement, useValue: seoSpy },
        { provide: Router, useValue: { events: routerEvents$.asObservable() } },
        { provide: ActivatedRoute, useValue: emptyRoute }
      ]
    });

    const service = TestBed.inject(SeoRouteListener);
    service.init();

    routerEvents$.next(new NavigationEnd(1, '/', '/'));
    expect(seoSpy.setSeo).toHaveBeenCalledWith({});
  });
});
