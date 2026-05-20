import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, output, PLATFORM_ID, viewChild } from '@angular/core';
import { ToastMessage } from '@shared/services/toast-message';
import { ReCaptchaLoader } from '@core/services/re-captcha-loader';
import { environment } from '@environments/environment.development';

declare const grecaptcha: any;

@Component({
  selector: 're-captcha-validator',
  imports: [],
  templateUrl: './re-captcha-validator.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReCaptchaValidator implements AfterViewInit {
  // ViewChild
  container = viewChild<ElementRef<HTMLDivElement>>('container');

  // Init
  private widgetId!: number;
  private env = environment;

  // Output signal
  public resolved = output<string>();

  // Injection
  private toast = inject(ToastMessage);
  private platformId = inject(PLATFORM_ID);
  private reCaptchaLoader = inject(ReCaptchaLoader);

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    await this.reCaptchaLoader.load();

    if (typeof grecaptcha === 'undefined') {
      this.toast.error('grecaptcha no está disponible');
      return;
    }

    grecaptcha.ready(() => {
      this.widgetId = grecaptcha.render(this.container()?.nativeElement, {
        sitekey: this.env.RECAPTCHA_REQUEST,
        theme: 'light',
        size: 'compact',
        callback: (token: string) => this.resolved.emit(token),
        'expired-callback': () => this.resolved.emit('')
      });
    });
  }

  reset() {
    if(this.widgetId !== undefined && typeof grecaptcha !== 'undefined'){
      grecaptcha.reset(this.widgetId);
    }
  }
}
