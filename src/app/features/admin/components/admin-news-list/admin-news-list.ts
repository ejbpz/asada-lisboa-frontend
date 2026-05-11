import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { NewsApi } from '@core/services/news-api';
import { ToastMessage } from '@shared/services/toast-message';
import { NewsAdminCard } from "../news-admin-card/news-admin-card";
import { NewResponse } from '@shared/interfaces/new-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';

@Component({
  selector: 'admin-news-list',
  imports: [NewsAdminCard],
  templateUrl: './admin-news-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex flex-col gap-3 my-5'
  }
})
export class AdminNewsList implements OnInit {
  // Init
  private isLoading = signal<boolean>(false);
  private isError = signal<string | null>(null);
  private isSuccess = signal<string | null>(null);
  protected selectedId = signal<string | null>(null);
  protected newsData = signal<NewResponse[]>([]);

  // Injection
  private newsApi = inject(NewsApi);
  private toastService = inject(ToastMessage);

  // Input signal
  public news = input.required<NewResponse[]>();
  public statuses = input.required<StatusResponse[]>();

  // View child
  private modal = viewChild.required<ElementRef<HTMLDialogElement>>('deleteNewModal')

  // News to signal
  ngOnInit(): void {
    this.newsData.set(this.news());
  }

  // Delete new
  protected openDeleteModal(id: string): void {
    this.selectedId.set(id);
    this.modal().nativeElement.showModal();
  }

  protected closeDeleteModal(): void {
    this.selectedId.set(null);
    this.modal().nativeElement.close();
  }

  protected confirmDelete(): void {
    const id = this.selectedId();
    if (!id) return;

    this.newsApiService(id);
  }

  private removeNewFromList(id: string): void {
    this.newsData.update(values =>
      values.filter(value => value.id !== id)
    );
  }

  // Delete new service
  private newsApiService(id: string): void {
    if(this.isLoading())
      return;

    this.isError.set(null)
    this.isLoading.set(true);

    this.newsApi.deleteNew(id)
      .subscribe({
        next: () => {
          this.isError.set(null);
          this.isSuccess.set('Noticia eliminada con éxito.');
          this.removeNewFromList(id);
          this.closeDeleteModal();
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
