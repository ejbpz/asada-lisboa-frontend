import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GalleryApi } from '@core/services/gallery-api';
import { StatusesApi } from '@core/services/statuses-api';
import { SearchBar } from "@shared/components/search-bar/search-bar";
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { BaseSearchPage } from '@shared/pages/base-search-page/base-search-page';
import { PaginationList } from "@shared/components/pagination-list/pagination-list";
import { AdminImagesList } from "@admin/components/admin-images-list/admin-images-list";

@Component({
  selector: 'admin-images-page',
  imports: [GetBackTitle, RouterLink, SearchBar, PaginationList, AdminImagesList],
  templateUrl: './admin-images-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full container my-12.5 md:my-25'
  }
})
export default class AdminImagesPage extends BaseSearchPage<GalleryApi, ImageResponse> implements AfterViewInit {
  // Init
  private isLoading = signal<boolean>(false);
  protected statuses = signal<StatusResponse[]>([]);

  // Injection
  private statusesApi = inject(StatusesApi);

  // Constructor
  constructor() {
    super(
      inject(Router),
      inject(GalleryApi),
      inject(ActivatedRoute),
    )
  }

  // AfterViewInit
  ngAfterViewInit(): void {
    this.statusesApiService();
  }

  // Base class implementation
  protected override fetch(service: GalleryApi, params: HttpParams) {
    return service.getAdminImages(params);
  }

  protected imagesResource = this.resource;

  // Get statuses
  private statusesApiService() {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.statusesApi.getStatuses()
      .subscribe({
        next: (value: StatusResponse[]) => {
          this.statuses.set(value);
          this.isLoading.set(false);
        },
        error: (_) => {
          this.isLoading.set(false);
        }
      })
  }

  // Search filters
  protected filterBy = [
    { value: 'category', name: 'Categoría' },
    { value: 'status', name: 'Estado' },
    { value: 'title', name: 'Título' },
  ];

  protected sortBy = [
    { value: 'date', name: 'Fecha' },
    { value: 'title', name: 'Título' },
  ];
}
