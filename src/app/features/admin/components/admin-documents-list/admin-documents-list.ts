import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { DocumentsApi } from '@core/services/documents-api';
import { ToastMessage } from '@shared/services/toast-message';
import { StatusResponse } from '@admin/interfaces/status-response.interface';
import { DocumentsAdminCard } from "../documents-admin-card/documents-admin-card";
import { DocumentMinimalResponse } from '@public/interfaces/document-minimal-response.interface';

@Component({
  selector: 'admin-documents-list',
  imports: [DocumentsAdminCard],
  templateUrl: './admin-documents-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center'
  }
})
export class AdminDocumentsList {
    // Init
  private isLoading = signal<boolean>(false);
  private isError = signal<string | null>(null);
  private isSuccess = signal<string | null>(null);
  protected selectedId = signal<string | null>(null);
  protected documentsData = signal<DocumentMinimalResponse[]>([]);

  // Injection
  private documentsApi = inject(DocumentsApi);
  private toastService = inject(ToastMessage);

  // Input signal
  public documents = input.required<DocumentMinimalResponse[]>();
  public statuses = input.required<StatusResponse[]>();

  // View child
  private modal = viewChild.required<ElementRef<HTMLDialogElement>>('deleteDocumentModal')

  // News to signal
  private documentsEffect = effect(() => {
    this.documentsData.set(this.documents());
  });

  // Delete document
  protected openDeleteModal(id: string): void {
    this.selectedId.set(id);
    this.modal().nativeElement.showModal();
  }

  protected confirmDelete(): void {
    const id = this.selectedId();
    if (!id) return;

    this.documentsApiService(id);
  }

  private removeDocumentFromList(id: string): void {
    this.documentsData.set(this.documents().filter((value: DocumentMinimalResponse) => value.id != id))
  }

  // Delete new service
  private documentsApiService(id: string): void {
    if(this.isLoading())
      return;

    this.isError.set(null)
    this.isLoading.set(true);

    this.documentsApi.deleteDocument(id)
      .subscribe({
        next: () => {
          this.isError.set(null);
          this.isSuccess.set('Documento eliminado con éxito.');
          this.removeDocumentFromList(id);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isSuccess.set(null);
          this.isError.set(error.error);
          this.isLoading.set(false);
        }
      })
  }

  // Toast error
  private showToast = effect(() => {
    this.toastService.showToast(
      this.isError() ? this.isError() : this.isSuccess(),
      this.isError() ? '❌' : '✔'
    );

    this.isError.set(null);
    this.isSuccess.set(null);
  });
}
