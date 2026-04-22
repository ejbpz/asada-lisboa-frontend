import { RouterLink } from "@angular/router";
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { environment } from "@environments/environment.development";
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
  private env = environment;

  // Input signal
  public newData = input.required<NewMinimalResponse | undefined>();
  public categories = input<boolean>(false);

  // Template methods
  protected imageFile(filePath: string | undefined): string {
    return `${this.env.API_URL_CONTENT}/${filePath ?? ''}`;
  }
}
