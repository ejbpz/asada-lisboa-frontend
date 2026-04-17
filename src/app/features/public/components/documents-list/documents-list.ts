import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'documents-list',
  imports: [],
  templateUrl: './documents-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center'
  }
})
export class DocumentsList {}
