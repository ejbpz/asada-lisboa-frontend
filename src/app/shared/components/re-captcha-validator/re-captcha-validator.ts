import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, output, PLATFORM_ID, signal, viewChild } from '@angular/core';
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
  private isError = signal<string | null>(null);

  // Output signal
  public resolved = output<string>();

  // Injection
  private platformId = inject(PLATFORM_ID);
  private toastService = inject(ToastMessage);
  private reCaptchaLoader = inject(ReCaptchaLoader);

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    await this.reCaptchaLoader.load();

    if (typeof grecaptcha === 'undefined') {
      this.isError.set('grecaptcha no está disponible');
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

  // Toast error
  private showToast = effect(() => {
    this.toastService.showToast(this.isError(), '❌');

    this.isError.set(null);
  });
}
