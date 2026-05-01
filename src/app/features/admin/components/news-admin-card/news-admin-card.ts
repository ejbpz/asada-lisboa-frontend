import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, effect, signal, output } from '@angular/core';
import { StatusResponse } from '@admin/interfaces/status-response.interface';
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
  // Init
  protected isLoading = signal<boolean>(false);
  protected isError = signal<string | null>(null);
  protected isSuccess = signal<string | null>(null);
  protected draftStatus = signal<StatusResponse>({ id: '', name: '' });
  protected publicStatus = signal<StatusResponse>({ id: '', name: '' });

  // Input signals
  public categories = input<boolean>(false);
  public statuses = input.required<StatusResponse[]>();
  public newData = input.required<NewMinimalResponse | undefined>();

  // Output signal
  public deleteRequest = output<string>();

  // Statuses methods
  private draftOrPosted = effect(() => {
    return this.statuses().forEach((value: StatusResponse) => {
      if(value.name.trim().toLowerCase() === 'borrador')
        this.draftStatus.set(value);

      if(value.name.trim().toLowerCase() === 'publicado')
        this.publicStatus.set(value);
    });
  });

  // Emit delete new
  onDeleteNew() {
    if(!(this.newData()?.id))
      return;

    this.deleteRequest.emit(this.newData()?.id ?? '');
  }
}
