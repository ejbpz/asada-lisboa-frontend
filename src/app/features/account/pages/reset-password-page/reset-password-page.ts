import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResetPasswordForm } from "@account/components/reset-password-form/reset-password-form";

@Component({
  selector: 'reset-password-page',
  imports: [ResetPasswordForm],
  templateUrl: './reset-password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center items-center h-full w-full'
  }
})
export default class ResetPasswordPage { }
