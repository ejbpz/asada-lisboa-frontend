import { TitleCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DirectorsBoardApi } from '@core/services/directors-board-api';
import { DirectorsBoardResponse } from '@public/interfaces/directors-board-response.interface';

@Component({
  selector: 'directors-list',
  imports: [TitleCasePipe],
  templateUrl: './directors-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
   host: {
    class: 'w-full flex justify-center items-center px-5'
  }
})
export class DirectorsList implements AfterViewInit {
   // Init
  protected isLoading = signal<boolean>(false);
  protected users = signal<DirectorsBoardResponse[] | null>(null);

  // Inject
  protected directorBoardService = inject(DirectorsBoardApi);

  // AfterViewInit
  ngAfterViewInit(): void {
    this.usersApiService();
  }

    // Calling principal API
  public usersApiService(): void {
    if(this.isLoading())
      return;

    this.isLoading.set(true);

    this.directorBoardService.getDirectorsBoardInformation()
      .subscribe({
        next: (directorsBoardResponse: DirectorsBoardResponse[]) => {
          this.users.set(directorsBoardResponse);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
  }
}
