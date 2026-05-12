import { inject, Injectable } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class ToastMessage {
  // Injections
  private toastService = inject(HotToastService);

  // Show toast messages
  public success(message: string) {
    this.toastService.show(message, {
      icon: '✔',
      theme: 'snackbar',
      position: 'top-right'
    });
  }

  public error(message: string) {
    this.toastService.show(message, {
      icon: '❌',
      theme: 'snackbar',
      position: 'top-right'
    });
  }

  public warning(message: string) {
    this.toastService.show(message, {
      icon: '⚠',
      theme: 'snackbar',
      position: 'top-right'
    });
  }

  public info(message: string) {
    this.toastService.show(message, {
      icon: 'ℹ',
      theme: 'snackbar',
      position: 'top-right'
    });
  }
}
