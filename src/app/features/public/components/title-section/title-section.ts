import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'title-section',
  imports: [],
  templateUrl: './title-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block mb-5 w-full md:w-1/2'
  }
})
export class TitleSection {}
