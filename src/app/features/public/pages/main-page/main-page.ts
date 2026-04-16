import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PrincipalApi } from '@core/services/principal-api';
import { PrincipalRequest } from '@public/interfaces/principal-response.interface';
import { PublicHeroSection } from "@public/components/public-hero-section/public-hero-section";
import { PublicNewsSection } from "@public/components/public-news-section/public-news-section";
import { PublicImagesSection } from "@public/components/public-images-section/public-images-section";
import { PublicDocumentsSection } from "@public/components/public-documents-section/public-documents-section";

@Component({
  selector: 'main-page',
  imports: [PublicHeroSection, PublicNewsSection, PublicImagesSection, PublicDocumentsSection],
  templateUrl: './main-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-base-100 block w-full h-full'
  }
})
export default class MainPage implements AfterViewInit {
  // Init
  protected isLoading = signal<boolean>(false);
  protected principalData = signal<PrincipalRequest | null>(null);

  // Injects
  private principalService = inject(PrincipalApi);

  // OnInit
  ngAfterViewInit(): void {
    this.principalApiService();
  }

  // Calling principal API
  protected principalApiService(): void {
      if(this.isLoading())
        return;

      this.isLoading.set(true);

      this.principalService.getPrincipalInformation()
        .subscribe({
          next: (principalRequest: PrincipalRequest) => {
            this.principalData.set(principalRequest);
            this.isLoading.set(false);
          }
        });
  }
}
