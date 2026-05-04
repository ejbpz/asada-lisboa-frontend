import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment.development';
import { PageResponse } from '@shared/interfaces/page-response.interface';
import { ImageMinimalResponse } from '@public/interfaces/image-minimal-response.interface';

@Injectable({
  providedIn: 'root'
})
export class GalleryApi {
  // Init
  private env = environment;

  // Injection
  private httpClient = inject(HttpClient);

  // Http calls
  public getPublicImages(params: HttpParams): Observable<PageResponse<ImageMinimalResponse>> {
    return this.httpClient.get<PageResponse<ImageMinimalResponse>>(`${this.env.API_URL_CLIENT}/imagenes`, { params }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => Error(error.error?.detail ?? error?.message ?? 'Error inesperado al obtener las imágenes.')))
    );
  }
}
