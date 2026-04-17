import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { DocumentsList } from "@public/components/documents-list/documents-list";
import { SearchBar } from "@shared/components/search-bar/search-bar";
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
export default class DocumentsPage { }
