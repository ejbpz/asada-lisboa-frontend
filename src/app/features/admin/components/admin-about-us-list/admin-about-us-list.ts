import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AboutUsResponse } from '@public/interfaces/about-us-response.interface';

@Component({
  selector: 'admin-about-us-list',
  imports: [],
  templateUrl: './admin-about-us-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-wrap items-center gap-2'
  }
})
export class AdminAboutUsList {
  // Input signal
  public aboutUsInput = input.required<AboutUsResponse[]>();
}
