import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.httpClient.get<PageResponse<ImageMinimalResponse>>(`${this.env.API_URL_CLIENT}/imagenes`, { params });
  }
}
