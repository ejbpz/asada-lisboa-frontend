import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoRouteListener } from '@core/services/seo-route-listener';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  constructor(private seoRouteListener: SeoRouteListener) {
    this.seoRouteListener.init();
  }
}
