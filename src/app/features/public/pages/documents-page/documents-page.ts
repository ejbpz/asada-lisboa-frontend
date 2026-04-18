import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { DocumentsApi } from '@core/services/documents-api';
import { SearchBar } from "@shared/components/search-bar/search-bar";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { DocumentsList } from "@public/components/documents-list/documents-list";
import { PaginationList } from "@shared/components/pagination-list/pagination-list";
import { SearchSortRequest } from '@shared/interfaces/search-sort-request.interface';

@Component({
  selector: 'documents-page',
  imports: [GetBackTitle, DocumentsList, SearchBar, PaginationList],
  templateUrl: './documents-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 flex flex-col justify-center items-center w-full h-full'
  }
})
export default class DocumentsPage {
  // Injection
  private router = inject(Router);
  private documentsApi = inject(DocumentsApi);
  private activatedRoute = inject(ActivatedRoute);

  // Document service
  protected documentsResource = rxResource({
    params: () => ({ filters: this.filters() }),
    stream: ({ params }) => {
      let httpParams = new HttpParams();

      if(params.filters.take) httpParams = httpParams.set('take', params.filters.take);
      if(params.filters.page) httpParams = httpParams.set('page', params.filters.page);
      if(params.filters.search) httpParams = httpParams.set('search', params.filters.search);
      if(params.filters.sortBy) httpParams = httpParams.set('sortBy', params.filters.sortBy);
      if(params.filters.offset) httpParams = httpParams.set('offset', params.filters.offset);
      if(params.filters.filterBy) httpParams = httpParams.set('filterBy', params.filters.filterBy);
      if(params.filters.sortDirection) httpParams = httpParams.set('sortDirection', params.filters.sortDirection);

      return this.documentsApi.getPublicDocuments(httpParams)
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
      take: request?.take || null,
      page: request?.page || null,
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
      take: params['take'] ?? '',
      page: params['page'] ?? '',
      search: params['search'] ?? '',
      sortBy: params['sortBy'] ?? '',
      offset: params['offset'] ?? '',
      filterBy: params['filterBy'] ?? '',
      sortDirection: params['sortDirection'] ?? 'asc',
    }
  }

  // Search filters
  protected filterBy = [
    { value: 'type', name: 'Tipo' },
    { value: 'category', name: 'Categoría' },
    { value: 'title', name: 'Título' },
  ];

  protected sortBy = [
    { value: 'date', name: 'Fecha' },
    { value: 'title', name: 'Título' },
  ]
}
