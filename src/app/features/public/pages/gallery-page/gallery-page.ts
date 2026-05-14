import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GalleryApi } from '@core/services/gallery-api';
import { SearchBar } from "@shared/components/search-bar/search-bar";
import { GalleryList } from "@public/components/gallery-list/gallery-list";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { BaseSearchPage } from '@shared/pages/base-search-page/base-search-page';
import { PaginationList } from "@shared/components/pagination-list/pagination-list";
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';

@Component({
  selector: 'gallery-page',
  imports: [GetBackTitle, SearchBar, PaginationList, GalleryList],
  templateUrl: './gallery-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GalleryPage extends BaseSearchPage<GalleryApi, ImageMinimalResponse> {
  // Constructor
  constructor() {
    super(
      inject(Router),
      inject(GalleryApi),
      inject(ActivatedRoute),
    )
  }

  // Base class implementation
  protected override fetch(service: GalleryApi, params: HttpParams) {
    return service.getPublicImages(params);
  }

  protected imagesResource = this.resource;

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
