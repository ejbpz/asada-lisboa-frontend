import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NewsCard } from "@shared/components/news-card/news-card";
import { environment } from '@environments/environment.development';
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Component({
  selector: 'news-list',
  imports: [NewsCard],
  templateUrl: './news-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'my-5 px-2 grid gap-3 grid-cols-1 justify-items-center sm:grid-cols-2 lg:grid-cols-3'
  }
})
export class NewsList {
  // Init
  private env = environment;

  // Injection
  private router = inject(Router);

  // Input signal
  public news = input.required<NewMinimalResponse[]>();

  // Search category
  protected searchCategory(category: string | null | undefined) {
    this.router.navigate([], {
      queryParams: { search: category, filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
