import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GenerateContent } from '@shared/utils/generate-content';
import { BadgesCarousel } from "../badges-carousel/badges-carousel";
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';

@Component({
  selector: 'images-card',
  imports: [BadgesCarousel, TitleCasePipe],
  templateUrl: './images-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesCard {
  // Init
  protected generateContent = GenerateContent;

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
}
