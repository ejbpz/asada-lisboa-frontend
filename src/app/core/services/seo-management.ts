import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { GenerateContent } from '@shared/utils/generate-content';

export interface SeoConfig {
  url?: string;
  title?: string;
  image?: string;
  noIndex?: boolean;
  description?: string;
  type?: 'website' | 'article';
}

@Injectable({
  providedIn: 'root',
})
export class SeoManagement {
  // Init
  private env = environment;
  private readonly defaultImage = `/logo/asada-logo.png`;
  private readonly baseTitle = 'ASADA de Urbanización Lisboa';
  private readonly defaultDescription = 'Sitio oficial de la ASADA de Urbanización Lisboa.';

  // Injections
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);


  setSeo(config: SeoConfig): void {

    const fullTitle = config.title
      ? `${config.title} - ${this.baseTitle}`
      : this.baseTitle;
    const description = config.description ?? this.defaultDescription;
    const image = `${this.env.APP_DOMAIN}${GenerateContent.url(config.image ?? this.defaultImage)}`;

    // TITLE
    this.title.setTitle(fullTitle);

    // DESCRIPTION
    this.updateTag('name', 'description', description);

    // ROBOTS
    this.updateTag(
      'name',
      'robots',
      config.noIndex
        ? 'noindex, nofollow'
        : 'index, follow'
    );

    // OPEN GRAPH
    this.updateTag('property', 'og:title', fullTitle);

    this.updateTag(
      'property',
      'og:description',
      description
    );

    this.updateTag(
      'property',
      'og:type',
      config.type ?? 'website'
    );

    this.updateTag(
      'property',
      'og:image',
      image
    );

    // TWITTER
    this.updateTag(
      'name',
      'twitter:card',
      'summary_large_image'
    );

    this.updateTag(
      'name',
      'twitter:title',
      fullTitle
    );

    this.updateTag(
      'name',
      'twitter:description',
      description
    );

    this.updateTag(
      'name',
      'twitter:image',
      image
    );

    // URL + CANONICAL
    if (config.url) {

      this.updateTag(
        'property',
        'og:url',
        config.url
      );

      this.setCanonical(config.url);
    }
  }

  private updateTag(
    attribute: 'name' | 'property',
    key: string,
    content: string
  ): void {

    this.meta.updateTag({
      [attribute]: key,
      content
    });
  }

  private setCanonical(url: string): void {

    let link =
      this.document.querySelector(
        "link[rel='canonical']"
      ) as HTMLLinkElement | null;

    if (!link) {

      link = this.document.createElement('link');

      link.setAttribute('rel', 'canonical');

      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
