import { Router } from '@angular/router';
import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { environment } from '@environments/environment.development';
import { DocumentTypeIcon } from '@shared/services/document-type-icon';
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';

@Component({
  selector: 'documents-list',
  imports: [TitleCasePipe, LowerCasePipe],
  templateUrl: './documents-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center'
  }
})
export class DocumentsList {
  // Init
  private env = environment;

  // Injection
  private router = inject(Router);
  private documentType = inject(DocumentTypeIcon);

  // Input signal
  public documents = input.required<DocumentMinimalResponse[]>();

  // Helper methods
  protected generateUrl(filePath: string): string {
    return `${this.env.API_URL_CONTENT}/${filePath}`;
  }

  protected iconType(filePath: string | undefined): string {
    return this.documentType.documentIcon(filePath);
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
