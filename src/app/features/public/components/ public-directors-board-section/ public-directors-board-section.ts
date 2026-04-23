import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DirectorsBoardApi } from '@core/services/directors-board-api';
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';

@Component({
  selector: 'public-directors-board-section',
  imports: [],
  templateUrl: './ public-directors-board-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
   host: {
    class: 'w-full flex justify-center items-center md:w-1/2'
  }
})
export class PublicDirectorsBoardSection implements AfterViewInit{
  
   // Init
  protected isLoading = signal<boolean>(false);
  protected directorBoardData = signal<DirectorsBoardResponse[] | null>(null);

  // Inject
  protected directorBoardService = inject(DirectorsBoardApi);

  // AfterViewInit
  ngAfterViewInit(): void {
    this.principalApiService();
  }

    // Calling principal API
  protected principalApiService(): void {
      if(this.isLoading())
        return;

      this.isLoading.set(true);

      this.directorBoardService.getDirectorsBoardInformation()
        .subscribe({
          next: (directorsBoardResponse: DirectorsBoardResponse[]) => {
            this.directorBoardData.set(directorsBoardResponse);
            this.isLoading.set(false);
          }
        });
  }




 }
