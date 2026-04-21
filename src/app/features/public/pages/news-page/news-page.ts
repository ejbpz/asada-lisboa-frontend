import { HttpParams } from '@angular/common/http';
import { NewsApi } from '@core/services/news-api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { NewsList } from '@public/components/news-list/news-list';
import { SearchBar } from "@shared/components/search-bar/search-bar";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { PaginationList } from "@shared/components/pagination-list/pagination-list";
import { SearchSortRequest } from '@shared/interfaces/search-sort-request.interface';

@Component({
  selector: 'news-page',
  imports: [GetBackTitle, SearchBar, PaginationList, NewsList],
  templateUrl: './news-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NewsPage {
    // Injection
  private router = inject(Router);
  private newsApi = inject(NewsApi);
  private activatedRoute = inject(ActivatedRoute);

  // Document service
  protected documentsResource = rxResource({
    params: () => ({ filters: this.filters() }),
    stream: ({ params }) => {
      let httpParams = new HttpParams();

      if(params.filters.search) httpParams = httpParams.set('search', params.filters.search);
      if(params.filters.sortBy) httpParams = httpParams.set('sortBy', params.filters.sortBy);
      if(params.filters.offset) httpParams = httpParams.set('offset', params.filters.offset);
      if(params.filters.filterBy) httpParams = httpParams.set('filterBy', params.filters.filterBy);
      if(params.filters.sortDirection) httpParams = httpParams.set('sortDirection', params.filters.sortDirection);

      return this.newsApi.getPublicNews(httpParams);
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
  protected filters = toSignal(
    this.activatedRoute.queryParams.pipe(
      map(params => this.fromQuery(params))
    ), {
      initialValue: this.fromQuery(this.activatedRoute.snapshot.queryParams)
    }
  );

  private fromQuery(params: Params): SearchSortRequest {
    return {
      search: params['search'] ?? '',
      sortBy: params['sortBy'] ?? '',
      offset: params['offset'] ?? '',
      filterBy: params['filterBy'] ?? '',
      sortDirection: params['sortDirection'] ?? 'asc',
    }
  }

  // Search filters
  protected filterBy = [
    { value: 'category', name: 'Categoría' },
    { value: 'title', name: 'Título' },
  ];

  protected sortBy = [
    { value: 'date', name: 'Fecha' },
    { value: 'title', name: 'Título' },
  ]
}
