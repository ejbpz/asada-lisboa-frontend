import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Search} from '@shared/pages/search/search';

@Component({
  selector: 'search-form',
  imports: [],
  templateUrl: './search-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchForm { 


  search = inject(Search);

 showSearch = signal(false);

   toggleSearch() {
    this.showSearch.update(value => !value);
  }
}
