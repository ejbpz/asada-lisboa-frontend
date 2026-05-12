import { Signal } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { rxResource, toSignal } from "@angular/core/rxjs-interop";
import { map, Observable } from 'rxjs';
import { PageResponse } from "@shared/interfaces/page-response.interface";
import { SearchSortRequest } from "@shared/interfaces/search-sort-request.interface";

export abstract class BaseSearchPage<TService, TItem> {
  // Init
  protected filters!: Signal<SearchSortRequest>;

  // Constructor
  protected constructor(protected router: Router, protected serviceApi: TService, protected activatedRoute: ActivatedRoute) {
    this.initFilters();
  }

  // Abstract
  protected abstract fetch(service: TService, params: HttpParams): Observable<PageResponse<TItem>>;

  // Document service
  protected readonly resource = rxResource<PageResponse<TItem>, { filters: SearchSortRequest }>({
    params: () => ({ filters: this.filters() }),
    stream: ({ params }) => {
      let httpParams = new HttpParams();

      if(params.filters.search) httpParams = httpParams.set('search', params.filters.search);
      if(params.filters.sortBy) httpParams = httpParams.set('sortBy', params.filters.sortBy);
      if(params.filters.offset) httpParams = httpParams.set('offset', params.filters.offset);
      if(params.filters.filterBy) httpParams = httpParams.set('filterBy', params.filters.filterBy);
      if(params.filters.sortDirection) httpParams = httpParams.set('sortDirection', params.filters.sortDirection);

      return this.fetch(this.serviceApi, httpParams);
    }
  });

  // Set data from search bar
  onSearchSortForm(event: SearchSortRequest | undefined) {
    this.router.navigate([], {
      queryParams: this.toQuery(event),
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  onOffsetChange(offset: number) {
    this.router.navigate([], {
      queryParams: { offset: offset },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  private toQuery(request: SearchSortRequest | undefined) {
    return {
      search: request?.search || null,
      sortBy: request?.sortBy || null,
      offset: request?.offset || null,
      filterBy: request?.filterBy || null,
      sortDirection: request?.sortDirection || null,
    };
  }

  // Get query params
  protected initFilters() {
    this.filters = toSignal(
      this.activatedRoute.queryParams.pipe(
        map(params => this.fromQuery(params))
      ), {
        initialValue: this.fromQuery(this.activatedRoute.snapshot.queryParams)
      }
    );
  }

  private fromQuery(params: Params): SearchSortRequest {
    return {
      search: params['search'] ?? '',
      sortBy: params['sortBy'] ?? '',
      offset: params['offset'] ?? '',
      filterBy: params['filterBy'] ?? '',
      sortDirection: params['sortDirection'] ?? 'asc',
    }
  }
}
