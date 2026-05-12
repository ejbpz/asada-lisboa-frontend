import { RouterOutlet } from '@angular/router';
import { Component, effect } from '@angular/core';
import { AuthApi } from '@core/services/auth-api';
import { ToastMessage } from '@shared/services/toast-message';
import { SeoRouteListener } from '@core/services/seo-route-listener';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  // Constructor
  constructor(private seoRouteListener: SeoRouteListener, authService: AuthApi, toast: ToastMessage) {
    this.seoRouteListener.init();

    effect(() => {
      if(authService.sessionExpired())
        toast.error('Tu sesión expiró. Inicia sesión nuevamente en otra pestaña.');
    });
  }
}
