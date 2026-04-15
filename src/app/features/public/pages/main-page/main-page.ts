import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PublicHeroSection } from "@public/components/public-hero-section/public-hero-section";
import { PublicNewsSection } from "@public/components/public-news-section/public-news-section";

@Component({
  selector: 'main-page',
  imports: [PublicHeroSection, PublicNewsSection],
  templateUrl: './main-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 block w-full h-full'
  }
})
export default class MainPage {}
