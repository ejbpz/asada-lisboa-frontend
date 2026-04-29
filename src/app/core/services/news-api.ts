import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { NewResponse } from '@shared/interfaces/new-response.interface';
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

  // Http public calls
  public getPublicNews(params: HttpParams): Observable<PageResponse<NewMinimalResponse>> {
    return this.httpClient.get<PageResponse<NewMinimalResponse>>(`${this.env.API_URL_CLIENT}/noticias`, { params });
  }

  public getPublicNew(slug: string): Observable<NewResponse> {
    return this.httpClient.get<NewResponse>(`${this.env.API_URL_CLIENT}/noticias/${slug}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener la noticia.')))
      );
  }

  public getRecommendedNews(slug: string): Observable<NewMinimalResponse[]> {
    return this.httpClient.get<NewMinimalResponse[]>(`${this.env.API_URL_CLIENT}/noticias/recomendaciones/${slug}`);
  }

  // Http admin calls
  public getAdminNews(params: HttpParams): Observable<PageResponse<NewMinimalResponse>> {
    return this.httpClient.get<PageResponse<NewMinimalResponse>>(`${this.env.API_URL_ADMIN}/noticias`, { params });
  }
}
