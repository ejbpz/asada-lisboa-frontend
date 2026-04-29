import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchForm } from "@public/components/search-form/search-form";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";

@Component({
  selector: 'search-page',
  imports: [SearchForm, GetBackTitle],
  templateUrl: './search-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  
  host: {
    class: 'bg-base-100 flex flex-col justify-center items-center w-full h-full'
  }

})
export default class SearchPage { }