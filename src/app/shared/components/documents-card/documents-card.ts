import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { environment } from "@environments/environment.development";
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';

@Component({
  selector: 'documents-card',
  imports: [TitleCasePipe],
  templateUrl: './documents-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'card bg-base-100 w-full shadow-sm rounded-sm text-base-content'
  }
})
export class DocumentsCard {
  // Init
  private env = environment;

  // Input signal
  public document = input.required<DocumentMinimalResponse | undefined>();

  // Template methods
  protected imageFile(imagePath: string | undefined): string {
    return `${this.env.API_URL_CONTENT}/${imagePath ?? ''}`;
  }
}
