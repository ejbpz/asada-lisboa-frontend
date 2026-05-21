import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { ImageResponse } from '@admin/interfaces/image-response.interface';
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';
import { ImageRequest } from '@admin/interfaces/image-request.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GalleryApi {
  // Init
  private env = environment;

  // Injection
  private httpClient = inject(HttpClient);

  // Http public calls
  public getPublicImages(params: HttpParams): Observable<PageResponse<ImageMinimalResponse>> {
    return this.httpClient.get<PageResponse<ImageMinimalResponse>>(`${this.env.API_URL_CLIENT}/imagenes`, { params }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener las imágenes.')))
    );
  }

  // Http admin calls
  public getAdminImages(params: HttpParams): Observable<PageResponse<ImageResponse>> {
    return this.httpClient.get<PageResponse<ImageResponse>>(`${this.env.API_URL_ADMIN}/imagenes`, { params })
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener las imágenes.')))
      );
  }

  public getAdminImage(id: string): Observable<ImageResponse> {
    return this.httpClient.get<ImageResponse>(`${this.env.API_URL_ADMIN}/imagenes/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener la imagen.')))
      );
  }

  public deleteImage(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.env.API_URL_ADMIN}/imagenes/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al eliminar la imagen.')))
      );
  }

  public createOrEditImage(newRequest: ImageRequest, id: string | undefined = undefined): Observable<ImageResponse> {
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
      return this.httpClient.put<ImageResponse>(`${this.env.API_URL_ADMIN}/imagenes/${id}`, formData)
        .pipe(
          catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al actualizar la imagen.')))
        );
    }

    return this.httpClient.post<ImageResponse>(`${this.env.API_URL_ADMIN}/imagenes`, formData)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al crear la imagen.')))
      );
  }
}
