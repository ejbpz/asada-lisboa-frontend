import { RouterLink } from "@angular/router";
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { ToastMessage } from "@shared/services/toast-message";
import { AppError } from "@core/interfaces/app-error.interface";
import { DirectorsBoardApi } from "@core/services/directors-board-api";
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';

@Component({
  selector: 'admin-users-list',
  imports: [TitleCasePipe, RouterLink],
  templateUrl: './admin-users-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center my-5'
  }
})
export class AdminUsersList implements OnInit {
  // Init
  protected isLoading = signal(false);
  protected selectedId = signal<string | null>(null);
  protected usersData = signal<DirectorsBoardResponse[]>([]);

  // Injector
  private toast = inject(ToastMessage);
  private usersApi = inject(DirectorsBoardApi);

  // Input signal
  public users = input.required<DirectorsBoardResponse[]>();

  // View child
  private modal = viewChild.required<ElementRef<HTMLDialogElement>>('deleteUserModal')

  // Users to signal
  ngOnInit(): void {
    this.usersData.set(this.users());
  };

  // Delete user
  onDeleteUser(id: string): void {
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

    this.userApiService(id);
  }

  private removeUserFromList(id: string): void {
    this.usersData.update(values =>
      values.filter(value => value.id !== id)
    );
  }

  // Delete user service
  private userApiService(id: string): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.usersApi.deleteUser(id)
      .subscribe({
        next: () => {
          this.toast.success('Usuario eliminado con éxito.');
          this.removeUserFromList(id);
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
