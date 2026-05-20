import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { DocumentsApi } from '@core/services/documents-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';
import { DocumentResponse } from '@admin/interfaces/document-response.interface';
import { DocumentsAdminCard } from "../documents-admin-card/documents-admin-card";

@Component({
  selector: 'admin-documents-list',
  imports: [DocumentsAdminCard],
  templateUrl: './admin-documents-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center'
  }
})
export class AdminDocumentsList implements OnInit {
  // Init
  private isLoading = signal<boolean>(false);
  protected selectedId = signal<string | null>(null);
  protected documentsData = signal<DocumentResponse[]>([]);

  // Injection
  private toast = inject(ToastMessage);
  private documentsApi = inject(DocumentsApi);

  // Input signal
  public documents = input.required<DocumentResponse[]>();
  public statuses = input.required<StatusResponse[]>();

  // View child
  private modal = viewChild.required<ElementRef<HTMLDialogElement>>('deleteDocumentModal')

  // News to signal
  ngOnInit(): void {
    this.documentsData.set(this.documents());
  }

  // Delete document
  public openDeleteModal(id: string): void {
    this.selectedId.set(id);
    this.modal().nativeElement.showModal();
  }

  public closeDeleteModal(): void {
    this.selectedId.set(null);
    this.modal().nativeElement.close();
  }

  public confirmDelete(): void {
    const id = this.selectedId();
    if (!id) return;

    this.documentsApiService(id);
  }

  private removeDocumentFromList(id: string): void {
    this.documentsData.update(values =>
      values.filter(value => value.id !== id)
    );
  }

  // Delete new service
  private documentsApiService(id: string): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.documentsApi.deleteDocument(id)
      .subscribe({
        next: () => {
          this.toast.success('Documento eliminado con éxito.');
          this.removeDocumentFromList(id);
          this.closeDeleteModal();
          this.isLoading.set(false);
        },
        error: (error: AppError) => {
          this.toast.error(error.message);
          this.isLoading.set(false);
        }
      })
  }
}
