import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AboutUsTimeline } from "@public/components/about-us-timeline/about-us-timeline";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";

@Component({
  selector: 'about-us-page',
  imports: [AboutUsTimeline, GetBackTitle],
  templateUrl: './about-us-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
   host: {
    class: 'bg-base-100 flex flex-col justify-center items-center w-full h-full'
  }
})
export default class AboutUsPage { }
