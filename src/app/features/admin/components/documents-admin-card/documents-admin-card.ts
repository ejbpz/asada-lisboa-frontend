import { RouterLink } from "@angular/router";
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { GenerateContent } from '@shared/utils/generate-content';
import { DocumentTypeIcon } from '@shared/services/document-type-icon';
import { StatusResponse } from '@admin/interfaces/status-response.interface';
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';

@Component({
  selector: 'documents-admin-card',
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './documents-admin-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-between items-center'
  }
})
export class DocumentsAdminCard {
  // Init
  protected generateContent = GenerateContent;
  protected isLoading = signal<boolean>(false);
  protected isError = signal<string | null>(null);
  protected isSuccess = signal<string | null>(null);
  protected draftStatus = signal<StatusResponse>({ id: '', name: '' });
  protected publicStatus = signal<StatusResponse>({ id: '', name: '' });

  // Injection
  private documentType = inject(DocumentTypeIcon);

  // Input signals
  public categories = input<boolean>(false);
  public statuses = input.required<StatusResponse[]>();
  public document = input.required<DocumentMinimalResponse | undefined>();

  // Output signal
  public deleteRequest = output<string>();

  // Statuses methods
  private draftOrPosted = effect(() => {
    return this.statuses().forEach((value: StatusResponse) => {
      if(value.name.trim().toLowerCase() === 'borrador')
        this.draftStatus.set(value);

      if(value.name.trim().toLowerCase() === 'publicado')
        this.publicStatus.set(value);
    });
  });

  // Emit delete document
  onDeleteDocument() {
    if(!(this.document()?.id))
      return;

    this.deleteRequest.emit(this.document()?.id ?? '');
  }

  // Helper methods
  protected iconType(fileName: string | undefined): string {
    return this.documentType.documentIcon(fileName);
  }
}
