import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col items-center sm:justify-between sm:flex-row'
  }
})
export class SearchBar { }
