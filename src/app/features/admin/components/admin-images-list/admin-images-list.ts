import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { GalleryApi } from '@core/services/gallery-api';
import { ToastMessage } from '@shared/services/toast-message';
import { AppError } from '@core/interfaces/app-error.interface';
import { ImagesAdminCard } from "../images-admin-card/images-admin-card";
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { StatusResponse } from '@admin/interfaces/status-response.interface';

@Component({
  selector: 'admin-images-list',
  imports: [ImagesAdminCard],
  templateUrl: './admin-images-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full [column-width:250px] gap-3 space-y-3 my-5'
  }
})
export class AdminImagesList implements OnInit {
  // Init
  private isLoading = signal<boolean>(false);
  protected selectedId = signal<string | null>(null);
  protected imagesData = signal<ImageResponse[]>([]);

  // Injection
  private toast = inject(ToastMessage);
  private imagesApi = inject(GalleryApi);

  // Input signal
  public images = input.required<ImageResponse[]>();
  public statuses = input.required<StatusResponse[]>();

  // View child
  private modal = viewChild.required<ElementRef<HTMLDialogElement>>('deleteImageModal')

  // News to signal
  ngOnInit(): void {
    this.imagesData.set(this.images());
  };

  // Delete document
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

    this.imagesApiService(id);
  }

  private removeImageFromList(id: string): void {
    this.imagesData.update(values =>
      values.filter(value => value.id !== id)
    );
  }

  // Delete new service
  private imagesApiService(id: string): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.imagesApi.deleteImage(id)
      .subscribe({
        next: () => {
          this.toast.success('Imagen eliminada con éxito.');
          this.removeImageFromList(id);
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
