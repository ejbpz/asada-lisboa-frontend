import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GenerateContent } from '@shared/utils/generate-content';
import { BadgesCarousel } from "@shared/components/badges-carousel/badges-carousel";
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';

@Component({
  selector: 'gallery-list',
  imports: [TitleCasePipe, BadgesCarousel],
  templateUrl: './gallery-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full [column-width:250px] gap-3 space-y-3 my-5'
  }
})
export class GalleryList {
  // Init
  protected generateContent = GenerateContent;

  // Injection
  private router = inject(Router);

  // Input signal
  public images = input.required<ImageMinimalResponse[]>();

  // Search category
  protected searchCategory(category: string | null | undefined) {
    this.router.navigate([], {
      queryParams: { search: category, filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
