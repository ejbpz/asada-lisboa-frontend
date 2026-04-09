import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalFooter } from "@shared/components/global-footer/global-footer";

@Component({
  selector: 'account-layout',
  imports: [RouterOutlet, GlobalFooter],
  templateUrl: './account-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "flex flex-col h-screen min-h-screen"
  }
})
export default class AccountLayout { }
