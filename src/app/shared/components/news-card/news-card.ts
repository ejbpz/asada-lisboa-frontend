import { Router, RouterLink } from "@angular/router";
import { DatePipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { environment } from "@environments/environment.development";
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Component({
  selector: 'news-card',
  imports: [DatePipe, TitleCasePipe, RouterLink, LowerCasePipe],
  templateUrl: './news-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card bg-base-100 w-68.5 min-w-68.5 sm:w-92 sm:min-w-92 shadow-sm'
  }
})
export class NewsCard {
  // Init
  private env = environment;

  // Injection
  private router = inject(Router)

  // Input signal
  public newData = input.required<NewMinimalResponse | undefined>();
  public categories = input<boolean>(false);

  // Template methods
  protected imageFile(fileName: string | undefined): string {
    return `${this.env.API_URL_CONTENT}/${fileName ?? ''}`;
  }

  protected searchCategory(category: string | null | undefined) {
    this.router.navigate([], {
      queryParams: { search: category, filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
