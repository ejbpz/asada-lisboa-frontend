import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NewsCard } from "@shared/components/news-card/news-card";
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
  // Input signal
  public news = input.required<NewMinimalResponse[]>();
}
