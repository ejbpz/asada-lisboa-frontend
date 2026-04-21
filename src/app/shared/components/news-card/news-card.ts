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
    class: 'w-full min-w-68.5 max-w-68.5 card bg-base-100 shadow-sm sm:max-w-92'
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
  protected imageFile(filePath: string | undefined): string {
    return `${this.env.API_URL_CONTENT}/${filePath ?? ''}`;
  }

  protected searchCategory(category: string | null | undefined) {
    this.router.navigate([], {
      queryParams: { search: category, filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
