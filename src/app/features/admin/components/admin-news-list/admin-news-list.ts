import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NewsAdminCard } from "../news-admin-card/news-admin-card";
import { StatusResponse } from '@admin/interfaces/status-response.interface';
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Component({
  selector: 'admin-news-list',
  imports: [NewsAdminCard],
  templateUrl: './admin-news-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-col gap-3 my-5'
  }
})
export class AdminNewsList {
  // Input signal
  public news = input.required<NewMinimalResponse[]>();
  public statuses = input.required<StatusResponse[]>();
}
