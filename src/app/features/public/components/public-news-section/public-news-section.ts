import { RouterLink } from "@angular/router";
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CarouselNews } from "../carousel-news/carousel-news";
import { TitleSection } from "@public/components/title-section/title-section";
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Component({
  selector: 'public-news-section',
  imports: [CarouselNews, TitleSection, RouterLink],
  templateUrl: './public-news-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center bg-base-content py-12.5 lg:py-25 px-4 lg:px-12 text-base-100'
  }
})
export class PublicNewsSection {
  // Input signal
  public news = input.required<NewMinimalResponse[] | undefined>();
}
