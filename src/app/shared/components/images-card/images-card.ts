import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { GenerateContent } from '@shared/utils/generate-content';
import { BadgesCarousel } from "../badges-carousel/badges-carousel";
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';

@Component({
  selector: 'images-card',
  imports: [BadgesCarousel, TitleCasePipe],
  templateUrl: './images-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block bg-base-100 rounded-sm shadow-sm break-inside-avoid overflow-hidden cursor-pointer',
  }
})
export class ImagesCard {
  // Init
  protected generateContent = GenerateContent;

  // Input signal
  public index = input.required<number>();

  // Output signal
  public showIndex = output<number>();

  // Injection
  private router = inject(Router);

  // Input signal
  public image = input.required<ImageMinimalResponse>();

  // Search category
  protected searchCategory(category: string | null | undefined) {
    this.router.navigate([], {
      queryParams: { search: category, filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  // Lightbox method
  onClickImage(): void {
    this.showIndex.emit(this.index());
  }
}
