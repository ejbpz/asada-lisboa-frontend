import { RouterLink } from "@angular/router";
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StripHtmlPipe } from "@shared/pipes/strip-html-pipe";
import { GenerateContent } from "@shared/utils/generate-content";
import { BadgesCarousel } from "../badges-carousel/badges-carousel";
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Component({
  selector: 'news-card',
  imports: [BadgesCarousel, DatePipe, TitleCasePipe, StripHtmlPipe, RouterLink],
  templateUrl: './news-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: `card bg-base-100 shadow-sm shrink-0 w-full sm:basis-[calc(50%-0.375rem)] lg:basis-[calc(33.333%-0.5rem)] xl:basis-[calc(25%-0.5625rem)]`
  }
})
export class NewsCard {
  // Init
  protected generateContent = GenerateContent;

  // Input signal
  public categories = input<boolean>(false);
  public newData = input.required<NewMinimalResponse | undefined>();
}
