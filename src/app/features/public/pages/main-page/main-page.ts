import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PublicHero } from "@public/components/public-hero/public-hero";

@Component({
  selector: 'main-page',
  imports: [PublicHero],
  templateUrl: './main-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 block w-full h-full'
  }
})
export default class MainPage { }
