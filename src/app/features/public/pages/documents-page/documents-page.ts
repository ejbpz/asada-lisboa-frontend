import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DocumentsApi } from '@core/services/documents-api';
import { SearchBar } from "@shared/components/search-bar/search-bar";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { DocumentsList } from "@public/components/documents-list/documents-list";
import { PaginationList } from "@shared/components/pagination-list/pagination-list";

@Component({
  selector: 'documents-page',
  imports: [GetBackTitle, DocumentsList, SearchBar, PaginationList],
  templateUrl: './documents-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 flex flex-col justify-center items-center w-full h-full'
  }
})
export default class DocumentsPage implements OnInit {
  // Injection
  private documentsApi = inject(DocumentsApi);

  // OnInit
  ngOnInit(): void {
    this.documentsResource.reload();
  }

  // Service
  protected documentsResource = rxResource({
    stream: () => this.documentsApi.getPublicDocuments()
  })
}
