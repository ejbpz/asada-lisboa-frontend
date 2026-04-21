import { HttpParams } from '@angular/common/http';
import { NewsApi } from '@core/services/news-api';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NewsList } from '@public/components/news-list/news-list';
import { SearchBar } from "@shared/components/search-bar/search-bar";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { BaseSearchPage } from '@shared/pages/base-search-page/base-search-page';
import { PaginationList } from "@shared/components/pagination-list/pagination-list";
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Component({
  selector: 'news-page',
  imports: [GetBackTitle, SearchBar, PaginationList, NewsList],
  templateUrl: './news-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NewsPage extends BaseSearchPage<NewsApi, NewMinimalResponse> {
  // Constructor
  constructor() {
    super(
      inject(Router),
      inject(NewsApi),
      inject(ActivatedRoute),
    )
  }

  // Base class implementation
  protected override fetch(service: NewsApi, params: HttpParams) {
    return service.getPublicNews(params);
  }

  protected newsResource = this.resource;

  // Search filters
  protected filterBy = [
    { value: 'category', name: 'Categoría' },
    { value: 'title', name: 'Título' },
  ];

  protected sortBy = [
    { value: 'date', name: 'Fecha' },
    { value: 'title', name: 'Título' },
  ];
}
