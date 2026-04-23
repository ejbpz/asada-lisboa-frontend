import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal  } from '@angular/core';
import { AboutUsApi } from '@core/services/about-us-api';
import { AboutUsResponse} from '@public/interfaces/about-us-response.interface';
import { BreakLinePipe } from '@shared/pipes/break-line-pipe';

@Component({
  selector: 'about-us-timeline',
  imports: [BreakLinePipe],
  templateUrl: './about-us-timeline.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-full flex justify-center p-5 overflow-hidden'
  }
})
export class AboutUsTimeline implements AfterViewInit{
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

  // Helper methods
  protected timelineSide(index: number): string {
    const base = 'mb-10';

    switch(index % 2) {
      case 0:
        return `${base} timeline-start md:text-end`;
      case 1:
        return `${base} timeline-end md:text-start`;
      default:
        return base;
    }
  }
 }
