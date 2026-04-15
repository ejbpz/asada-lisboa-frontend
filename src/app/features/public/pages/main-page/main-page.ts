import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PublicHeroSection } from "@public/components/public-hero-section/public-hero-section";
import { PublicNewsSection } from "@public/components/public-news-section/public-news-section";
import { PublicImagesSection } from "@public/components/public-images-section/public-images-section";

@Component({
  selector: 'main-page',
  imports: [PublicHeroSection, PublicNewsSection, PublicImagesSection],
  templateUrl: './main-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 block w-full h-full'
  }
})
export default class MainPage {}
