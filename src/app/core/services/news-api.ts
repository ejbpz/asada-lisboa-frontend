import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { NewRequest } from '@admin/interfaces/new-request.interface';
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
    return this.httpClient.get<PageResponse<NewMinimalResponse>>(`${this.env.API_URL_CLIENT}/noticias`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener las noticias.')))
      );
  }

  public getPublicNew(slug: string): Observable<NewResponse> {
    return this.httpClient.get<NewResponse>(`${this.env.API_URL_CLIENT}/noticias/${slug}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener la noticia.')))
      );
  }

  public getRecommendedNews(slug: string): Observable<NewMinimalResponse[]> {
    return this.httpClient.get<NewMinimalResponse[]>(`${this.env.API_URL_CLIENT}/noticias/recomendaciones/${slug}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener las recomendaciones.')))
      );
  }

  // Http admin calls
  public getAdminNews(params: HttpParams): Observable<PageResponse<NewMinimalResponse>> {
    return this.httpClient.get<PageResponse<NewMinimalResponse>>(`${this.env.API_URL_ADMIN}/noticias`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener las noticias.')))
      );
  }

  public getAdminNew(id: string): Observable<NewResponse> {
    return this.httpClient.get<NewResponse>(`${this.env.API_URL_ADMIN}/noticias/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener la noticia.')))
      );
  }

  public createOrEditNew(newRequest: NewRequest, id: string | undefined = undefined): Observable<NewResponse> {
    const formData = new FormData();

    formData.append('title', newRequest.title);

    if(newRequest.file)
      formData.append('file', newRequest.file);

    formData.append('statusId', newRequest.statusId);
    formData.append('description', newRequest.description);

    newRequest.categories.forEach((cat: any, index: number) => {
      if (cat.id !== null && cat.id !== undefined)
        formData.append(`categories[${index}].id`, cat.id);

      formData.append(`categories[${index}].name`, cat.name);
    });

    if(id !== null && id !== undefined) {
      return this.httpClient.put<NewResponse>(`${this.env.API_URL_ADMIN}/noticias/${id}`, formData)
        .pipe(
          catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al actualizar la noticia.')))
        );
    }

    return this.httpClient.post<NewResponse>(`${this.env.API_URL_ADMIN}/noticias`, formData)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al crear la noticia.')))
      );
  }

  public deleteNew(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/noticias/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al eliminar la noticia.')))
      );
  }
}
