import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { SeoManagement } from './seo-management';

@Injectable({
  providedIn: 'root',
})
export class SeoRouteListener {
  private router = inject(Router);
  private seo = inject(SeoManagement);
  private route = inject(ActivatedRoute);

  init() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),

      map(() => {
        let currentRoute = this.route;

        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        return currentRoute.snapshot.data['seo'];
      })

    ).subscribe(seoData => {

      if (!seoData) {
        this.seo.setSeo({});
        return;
      }

      this.seo.setSeo(seoData);
    });
  }
}
