import { RouterLink } from "@angular/router";
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { GenerateContent } from "@shared/utils/generate-content";
import { DocumentTypeIcon } from '@shared/services/document-type-icon';
import { TitleSection } from "@public/components/title-section/title-section";
import { DocumentsCard } from "@shared/components/documents-card/documents-card";
import { PrincipalRequest } from "@public/interfaces/principal-response.interface";

@Component({
  selector: 'admin-dashboard',
  imports: [TitleCasePipe, TitleSection, RouterLink, DocumentsCard],
  templateUrl: './admin-dashboard-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex py-12.5 lg:py-25 px-4 lg:px-12'
  }
})
export class AdminDashboard {
  // Injection
  private documentType = inject(DocumentTypeIcon);

  // Init
  protected generateContent = GenerateContent;

  // Input signal
  public principalData = input<PrincipalRequest | null>();

  // Template methods
  protected iconType(filePath: string | undefined): string {
    return this.documentType.documentIcon(filePath);
  }

  // Default values
  protected title: string = '¡bienvenido/a administrador/a!';
  protected subtitle: string = 'Resumen de actividades recientes';
}
