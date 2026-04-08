import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicNavbar } from "@public/components/public-navbar/public-navbar";
import { PublicFooter } from "@public/components/public-footer/public-footer";

@Component({
  selector: 'public-layout',
  imports: [RouterOutlet, PublicNavbar, PublicFooter],
  templateUrl: './public-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "flex flex-col h-screen min-h-screen"
  }
})
export default class PublicLayout { }
