import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { environment } from "@environments/environment.development";
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'news-card',
  imports: [DatePipe, TitleCasePipe, RouterLink],
  templateUrl: './news-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card bg-base-100 w-92 min-w-92 shadow-sm'
  }
})
export class NewsCard {
  // Init
  private env = environment;

  // Input signal
  public newData = input.required<NewMinimalResponse | undefined>();

  // Template methods
  protected imageFile(imagePath: string | undefined): string {
    return `${this.env.API_URL_CONTENT}/${imagePath ?? ''}`;
  }
}
