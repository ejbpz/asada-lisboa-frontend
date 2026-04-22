import { RouterLink } from "@angular/router";
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GenerateContent } from "@shared/utils/generate-content";
import { BadgesCarousel } from "../badges-carousel/badges-carousel";
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Component({
  selector: 'news-card',
  imports: [BadgesCarousel, DatePipe, TitleCasePipe, RouterLink],
  templateUrl: './news-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full min-w-68.5 card bg-base-100 shadow-sm md:min-w-75 sm:max-w-92'
  }
})
export class NewsCard {
  // Init
  protected generateContent = GenerateContent;

  // Input signal
  public categories = input<boolean>(false);
  public newData = input.required<NewMinimalResponse | undefined>();
}
