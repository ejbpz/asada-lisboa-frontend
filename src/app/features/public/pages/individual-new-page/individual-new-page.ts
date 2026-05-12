import { ActivatedRoute, Router } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { EMPTY, map } from 'rxjs';
import { NewsApi } from '@core/services/news-api';
import { SeoManagement } from '@core/services/seo-management';
import { environment } from '@environments/environment.development';
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
  private seo = inject(SeoManagement);
  private newsService = inject(NewsApi);

  // Getting slug from route
  private slug = toSignal(
    inject(ActivatedRoute).params.pipe(
      map(param => param['slug'])
    )
  );

  // Calling service to get new with that slug
  protected readonly newResource = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => {
      if(!params.slug)
        return EMPTY;

      return this.newsService.getPublicNew(params.slug);
    }
  });

  // Calling service to get news related
  protected readonly relatedNewsResource = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => {
      if(!params.slug)
        return EMPTY;

      return this.newsService.getRecommendedNews(params.slug);
    }
  });

  // SEO for dynamic routes
  private updateSeo = effect(() => {
    const news = this.newResource.value();

    if(!news) return;

    this.seo.setSeo({
      url: `${environment.APP_URL}/noticias/${news.slug}`,
      image: `${environment.APP_URL}/${news.filePath}`,
      description: news.description,
      title: news.title,
      type: 'article',
      noIndex: false,
    })
  });

  // Returns to 404 when slug doesn't exist
  private slugNotFound = effect(() => {
    if(this.newResource.error())
      this.router.navigate(['/noticia-no-encontrada']);
  });
}
