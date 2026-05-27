import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { SearchForm } from "@public/components/search-form/search-form";

@Component({
  selector: 'global-search-page',
  imports: [GetBackTitle, SearchForm],
  templateUrl: './global-search-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GlobalSearchPage {}
