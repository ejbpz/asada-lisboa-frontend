import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DocumentsApi } from '@core/services/documents-api';
import { SearchBar } from "@shared/components/search-bar/search-bar";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { DocumentsList } from "@public/components/documents-list/documents-list";
import { BaseSearchPage } from '@shared/pages/base-search-page/base-search-page';
import { PaginationList } from "@shared/components/pagination-list/pagination-list";
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';

@Component({
  selector: 'documents-page',
  imports: [GetBackTitle, DocumentsList, SearchBar, PaginationList],
  templateUrl: './documents-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 flex flex-col justify-center items-center w-full h-full'
  }
})
export default class DocumentsPage extends BaseSearchPage<DocumentsApi, DocumentMinimalResponse> {
  // Constructor
  constructor() {
    super(
      inject(Router),
      inject(DocumentsApi),
      inject(ActivatedRoute),
    )
  }

  // Base class implementation
  protected override fetch(service: DocumentsApi, params: HttpParams) {
    return service.getPublicDocuments(params);
  }

  protected documentsResource = this.resource;

  // Search filters
  protected filterBy = [
    { value: 'type', name: 'Tipo' },
    { value: 'category', name: 'Categoría' },
    { value: 'title', name: 'Título' },
  ];

  protected sortBy = [
    { value: 'date', name: 'Fecha' },
    { value: 'title', name: 'Título' },
  ];
}
