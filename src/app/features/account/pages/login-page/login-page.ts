import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginForm } from "@account/components/login-form/login-form";
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";

@Component({
  selector: 'login-page',
  imports: [LoginForm, GetBackTitle],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col gap-5 justify-center items-center h-full w-full container'
  }
})
export default class LoginPage { }
