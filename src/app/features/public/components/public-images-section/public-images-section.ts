import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { environment } from '@environments/environment.development';
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';
import { TitleSection } from "@shared/components/title-section/title-section";

@Component({
  selector: 'public-images-section',
  imports: [TitleSection],
  templateUrl: './public-images-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center py-12.5 lg:py-25 px-4 lg:px-12'
  }
})
export class PublicImagesSection {
  // Init
  private env = environment;

  // Input signal
  public images = input.required<ImageMinimalResponse[] | undefined>();

  // Template methods
  protected imageFile(imagePath: string | undefined): string {
    return `${this.env.API_URL_CONTENT}/${imagePath ?? ''}`;
  }

  protected getImageClasses(index: number): string {
    const base = 'w-full h-auto sm:h-full object-cover rounded-lg shadow-md';

    switch (index) {
      case 0:
        return `${base} sm:col-start-1 sm:row-start-1`;
      case 1:
        return `${base} sm:col-start-1 sm:row-start-2`;
      case 2:
        return `${base} sm:col-start-2 sm:row-start-1 sm:row-span-2`;
      case 3:
        return `${base} sm:col-start-3 sm:row-start-1`;
      case 4:
        return `${base} sm:col-start-3 sm:row-start-2`;
      case 5:
        return `${base} sm:col-start-4 sm:row-start-1 sm:row-span-2`;
      default:
        return base;
    }
  }
}
