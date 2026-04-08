import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'public-navbar',
  imports: [],
  templateUrl: './public-navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-neutral-content shadow-sm w-full flex justify-center'
  }
})
export class PublicNavbar {
  logo = 'logo/asada-logo.svg';
}
