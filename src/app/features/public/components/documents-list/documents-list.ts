import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { environment } from '@environments/environment.development';
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';

@Component({
  selector: 'documents-list',
  imports: [TitleCasePipe],
  templateUrl: './documents-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center'
  }
})
export class DocumentsList {
  // Init
  private env = environment;

  // Input signal
  public documents = input.required<DocumentMinimalResponse[]>();

  // Helper methods
  protected generateUrl(filePath: string): string {
    return `${this.env.API_URL_CONTENT}/${filePath}`;
  }
}
