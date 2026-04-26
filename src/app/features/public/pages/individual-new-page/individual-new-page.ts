import { ActivatedRoute, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { EMPTY, map } from 'rxjs';
import { NewsApi } from '@core/services/news-api';
import { GetBackTitle } from "@shared/components/get-back-title/get-back-title";
import { IndividualNewCard } from "@public/components/individual-new-card/individual-new-card";
import { PublicNewsSection } from "@public/components/public-news-section/public-news-section";

@Component({
  selector: 'app-individual-new-page',
  imports: [GetBackTitle, IndividualNewCard, PublicNewsSection],
  templateUrl: './individual-new-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col justify-center items-center w-full'
  }
})
export default class IndividualNewPage {
  // Injection
  private router = inject(Router);
  private newsService = inject(NewsApi);

  // Getting slug from route
  private slug = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(param => param['slug'])
    )
  );

  // Calling service to get new with that slug
  protected newResource = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => {
      if(!params.slug)
        return EMPTY;

      return this.newsService.getPublicNew(params.slug);
    }
  });

  // Returns to 404 when slug doesn't exist
  private slugNotFound = effect(() => {
    if(this.newResource.error())
      this.router.navigate(['/noticia-no-encontrada']);
  });
}
