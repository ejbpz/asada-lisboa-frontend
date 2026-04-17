import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pagination-list',
  imports: [],
  templateUrl: './pagination-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center'
  }
})
export class PaginationList { }
