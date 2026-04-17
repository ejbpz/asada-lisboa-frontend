import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResetPasswordForm } from "@account/components/reset-password-form/reset-password-form";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";

@Component({
  selector: 'reset-password-page',
  imports: [ResetPasswordForm, GetBackTitle],
  templateUrl: './reset-password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-5 justify-center items-center h-full w-full container'
  }
})
export default class ResetPasswordPage { }
