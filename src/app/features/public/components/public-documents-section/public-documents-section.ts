import { RouterLink } from "@angular/router";
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TitleSection } from "@shared/components/title-section/title-section";
import { DocumentsCard } from "@shared/components/documents-card/documents-card";
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';

@Component({
  selector: 'public-documents-section',
  imports: [TitleSection, DocumentsCard, RouterLink],
  templateUrl: './public-documents-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center bg-[#cfd7e4] py-12.5 lg:py-25 px-4 lg:px-12'
  }
})
export class PublicDocumentsSection {
  public documents = input.required<DocumentMinimalResponse[] | undefined>();
}
