import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { NewMinimalResponse } from '@public/interfaces/new-minimal-response.interface';

@Injectable({
  providedIn: 'root'
})
export class NewsApi {
  // Init
  private env = environment;

  // Injection
  private httpClient = inject(HttpClient);

  // Http calls
  public getPublicNews(params: HttpParams): Observable<PageResponse<NewMinimalResponse>> {
    return this.httpClient.get<PageResponse<NewMinimalResponse>>(`${this.env.API_URL_CLIENT}/noticias`, { params });
  }
}
