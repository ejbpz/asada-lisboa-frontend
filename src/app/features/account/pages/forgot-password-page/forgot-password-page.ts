import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ForgotPasswordForm } from '@account/components/forgot-password-form/forgot-password-form';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";

@Component({
  selector: 'forgot-password-page',
  imports: [ForgotPasswordForm, GetBackTitle],
  templateUrl: './forgot-password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center h-full w-full gap-5 container'
  }
})
export default class ForgotPasswordPage { }
