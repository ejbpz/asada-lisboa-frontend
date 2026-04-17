import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal  } from '@angular/core';
import { AboutUsApi } from '@core/services/about-us-api';
import { AboutUsResponse} from '@public/interfaces/about-us-response.interface';

@Component({
  selector: 'about-us',
  imports: [],
  templateUrl: './about-us.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUs implements AfterViewInit{
// Init
  protected isLoading = signal<boolean>(false);
  protected aboutUsData = signal<AboutUsResponse[] | null>(null);

  // Inject
  protected aboutUsService = inject(AboutUsApi);

  // AfterViewInit
  ngAfterViewInit(): void {
    this.principalApiService();
  }

 // Calling principal API
  protected principalApiService(): void {
      if(this.isLoading())
        return;

      this.isLoading.set(true);

      this.aboutUsService.getAboutUsInformation()
        .subscribe({
          next: (aboutUSResponse: AboutUsResponse[]) => {
            this.aboutUsData.set(aboutUSResponse);
            this.isLoading.set(false);
          }
        });
  }




 }
