import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GenerateContent } from '@shared/utils/generate-content';
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Component({
  selector: 'news-admin-card',
  imports: [TitleCasePipe, DatePipe, RouterLink],
  templateUrl: './news-admin-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full p-5 rounded-sm shadow-sm bg-base-300 flex justify-between items-center'
  }
})
export class NewsAdminCard {
  // Input signal
  public categories = input<boolean>(false);
  public newData = input.required<NewMinimalResponse | undefined>();
}
