import { inject, Injectable } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class ToastMessage {
  // Injections
  private toastService = inject(HotToastService);

  // Show toast message
  public showToast(message: string | null, icon: string | null) {
    if(!message || !icon)
      return;

    this.toastService.show(message, {
      icon: icon,
      theme: 'snackbar',
      position: 'top-right'
    });
  }
}
