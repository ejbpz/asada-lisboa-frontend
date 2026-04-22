import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GenerateContent } from '@shared/utils/generate-content';
import { DocumentTypeIcon } from '@shared/services/document-type-icon';
import { BadgesCarousel } from "@shared/components/badges-carousel/badges-carousel";
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';

@Component({
  selector: 'documents-list',
  imports: [TitleCasePipe, BadgesCarousel],
  templateUrl: './documents-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center'
  }
})
export class DocumentsList {
  // Init
  protected generateContent = GenerateContent;

  // Injection
  private router = inject(Router);
  private documentType = inject(DocumentTypeIcon);

  // Input signal
  public documents = input.required<DocumentMinimalResponse[]>();

  // Helper methods
  protected iconType(fileName: string | undefined): string {
    return this.documentType.documentIcon(fileName);
  }

  // Search category
  protected searchCategory(category: string | null | undefined) {
    this.router.navigate([], {
      queryParams: { search: category, filterBy: 'category' },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
