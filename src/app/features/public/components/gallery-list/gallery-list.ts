import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ImagesCard } from "@shared/components/images-card/images-card";
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';

@Component({
  selector: 'gallery-list',
  imports: [ImagesCard],
  templateUrl: './gallery-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full [column-width:250px] gap-3 space-y-3 my-5'
  }
})
export class GalleryList {
  // Input signal
  public images = input.required<ImageMinimalResponse[]>();
}
