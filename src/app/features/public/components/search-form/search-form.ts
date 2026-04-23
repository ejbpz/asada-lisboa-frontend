import { AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SearchApi } from '@core/services/search-api';
import { SearchReponse } from '@public/interfaces/search-reponse.interface';

@Component({
  selector: 'app-search-form',
  imports: [],
  templateUrl: './search-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchForm { 

// Init
  protected isLoading = signal<boolean>(false);
  protected searchData = signal<SearchReponse[] | null>(null);

  // Inject
  protected searchService = inject(SearchApi);

  // AfterViewInit
  ngAfterViewInit(): void {
    this.principalApiService();
  }


 // Calling principal API
  protected principalApiService(): void {
      if(this.isLoading())
        return;

      this.isLoading.set(true);

      this.searchService.getsearchInformation()
        .subscribe({
          next: (searchReponse: SearchReponse[]) => {
            this.searchData.set(searchReponse);
            this.isLoading.set(false);
          }
        });     
  }

results: SearchReponse[] = [];
query: string = '';

buscar() {
  this.searchService.search(this.query).subscribe(data => {
    this.results = data;
  });
}



}
