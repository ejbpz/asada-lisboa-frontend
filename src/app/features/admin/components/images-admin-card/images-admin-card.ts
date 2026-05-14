import { RouterLink } from "@angular/router";
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { GenerateContent } from '@shared/utils/generate-content';
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';

@Component({
  selector: 'images-admin-card',
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './images-admin-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block bg-base-100 rounded-sm shadow-sm break-inside-avoid overflow-hidden cursor-pointer',
  }
})
export class ImagesAdminCard {
  // Init
  protected generateContent = GenerateContent;
  protected isLoading = signal<boolean>(false);
  protected isError = signal<string | null>(null);
  protected isSuccess = signal<string | null>(null);
  protected draftStatus = signal<StatusResponse>({ id: '', name: '' });
  protected publicStatus = signal<StatusResponse>({ id: '', name: '' });

  // Input signals
  public categories = input<boolean>(false);
  public statuses = input.required<StatusResponse[]>();
  public image = input.required<ImageResponse | undefined>();

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
  onDeleteImage() {
    if(!(this.image()?.id))
      return;

    this.deleteRequest.emit(this.image()?.id ?? '');
  }
}
