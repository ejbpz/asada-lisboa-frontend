import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ForgotPasswordForm } from '@account/components/forgot-password-form/forgot-password-form';

@Component({
  selector: 'forgot-password-page',
  imports: [ForgotPasswordForm],
  templateUrl: './forgot-password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center items-center h-full w-full'
  }
})
export default class ForgotPasswordPage { }
