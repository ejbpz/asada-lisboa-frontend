import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReCaptchaLoader {
  // Init
  private loaded = false;
  private loadingPromise?: Promise<void>;

  // Injection
  private plaformId = inject(PLATFORM_ID);

  // Load method
  load(): Promise<void> {
    if (!isPlatformBrowser(this.plaformId))
      return Promise.resolve();

    if (this.loaded)
      return Promise.resolve();

    if (this.loadingPromise)
      return this.loadingPromise;

    this.loadingPromise = new Promise((resolve) => {
      const script = document.createElement('script');

      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

      script.onload = () => {
        this.loaded = true;
        resolve();
      };

      document.body.appendChild(script);
    });

    return this.loadingPromise;
  }
}
