import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'news-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './news-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card bg-base-100 w-92 min-w-92 shadow-sm'
  }
})
export class NewsCard { }
