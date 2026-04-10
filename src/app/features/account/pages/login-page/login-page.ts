import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginForm } from "@account/components/login-form/login-form";

@Component({
  selector: 'login-page',
  imports: [LoginForm],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex justify-center items-center h-full w-full'
  }
})
export default class LoginPage { }
