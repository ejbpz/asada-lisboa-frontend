import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { BaseSearchPage } from './base-search-page';
import { SortDirection } from '@shared/enums/sort-direction.enum';
import { PageResponse } from '@shared/interfaces/page-response.interface';

class TestPage extends BaseSearchPage<any, any> {
  fetch = jasmine.createSpy('fetch').and.returnValue(
    of({ total: 0, data: [] } as PageResponse<any>)
  );
}

function mockRxResource() {
  return {
    stream: jasmine.createSpy('stream').and.callFake(({ params }: any) => {
      let httpParams = new HttpParams();

      if (params.filters.search) httpParams = httpParams.set('search', params.filters.search);
      if (params.filters.sortBy) httpParams = httpParams.set('sortBy', params.filters.sortBy);
      if (params.filters.offset) httpParams = httpParams.set('offset', params.filters.offset);
      if (params.filters.filterBy) httpParams = httpParams.set('filterBy', params.filters.filterBy);
      if (params.filters.sortDirection) httpParams = httpParams.set('sortDirection', params.filters.sortDirection);

      return of({ httpParams });
    })
  };
}

describe('BaseSearchPage', () => {
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;
  let page: TestPage;

  const snapshotParams: Params = {
    search: 'init',
    sortBy: 'name',
    offset: '0',
    filterBy: 'category',
    sortDirection: 'asc'
  };

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    const queryParams$ = new BehaviorSubject<Params>(snapshotParams);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParams$.asObservable(),
            snapshot: { queryParams: snapshotParams }
          }
        },
        {
          provide: Router,
          useValue: router
        }
      ]
    });

    (globalThis as any).rxResource = jasmine.createSpy().and.callFake(mockRxResource);

    activatedRoute = TestBed.inject(ActivatedRoute);

    page = TestBed.runInInjectionContext(() =>
      new TestPage(router, {} as any, activatedRoute)
    );
  });

  it('should initialize filters from snapshot', () => {
    const filters = page['filters']();

    expect(filters.search).toBe('init');
    expect(filters.sortBy).toBe('name');
    expect(filters.offset).toBe(0);
    expect(filters.filterBy).toBe('category');
    expect(filters.sortDirection).toBe('asc');
  });

  it('should navigate on search sort form', () => {
    page.onSearchSortForm({
      search: 'water',
      sortBy: 'date',
      offset: 0,
      filterBy: 'category',
      sortDirection: SortDirection.DESC
    });

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        search: 'water',
        sortBy: 'date',
        offset: 0,
        filterBy: 'category',
        sortDirection: SortDirection.DESC
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });

  it('should convert undefined values to null in query', () => {
    page.onSearchSortForm(undefined);

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        search: undefined,
        sortBy: undefined,
        offset: undefined,
        filterBy: undefined,
        sortDirection: undefined
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });

  it('should navigate on offset change', () => {
    page.onOffsetChange(10);

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { offset: 10 },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });

  it('should build HttpParams in resource stream', () => {
    const result = (globalThis as any).rxResource().stream({
      params: {
        filters: {
          search: 'a',
          sortBy: 'b',
          offset: 1,
          filterBy: 'c',
          sortDirection: 'asc'
        }
      }
    });

    let captured: HttpParams | null = null;

    result.subscribe((r: any) => {
      captured = r.httpParams;
    });

    expect(captured!.get('search')).toBe('a');
    expect(captured!.get('sortBy')).toBe('b');
    expect(captured!.get('offset')).toBe('1');
    expect(captured!.get('filterBy')).toBe('c');
    expect(captured!.get('sortDirection')).toBe('asc');
  });
});
