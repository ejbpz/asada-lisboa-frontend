import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleSection } from "@shared/components/title-section/title-section";
import { DocumentsCard } from "@shared/components/documents-card/documents-card";

@Component({
  selector: 'public-documents-section',
  imports: [TitleSection, DocumentsCard],
  templateUrl: './public-documents-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center bg-[#cfd7e4] py-12.5 lg:py-25 px-4 lg:px-12'
  }
})
export class PublicDocumentsSection { }
