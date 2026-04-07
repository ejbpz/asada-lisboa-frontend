import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'not-found-page',
  imports: [],
  templateUrl: './not-found-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NotFoundPage { }
