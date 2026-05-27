import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { SearchResponse } from '@public/interfaces/search-response.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchApi {
  // Init
  private env = environment;

  // Injection
  private httpClient = inject(HttpClient);

  // Http call
  public searchPublicData(query: string): Observable<SearchResponse[]> {
    const params = new HttpParams()
      .append('query', query)

    return this.httpClient.get<SearchResponse[]>(`${this.env.API_URL_CLIENT}/buscador`, { params })
  }
}
